import { HoldingItem, TaxOpportunity, VaultDocument } from './types';

const CORE_API_URL = (import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const ADVISOR_API_URL = (import.meta.env.VITE_ADVISOR_API_URL || 'http://localhost:3002').replace(/\/$/, '');

type LoginResponse = { accessToken: string; person?: { id: string; householdId?: string }; user?: { sub: string; roles: Array<{ scopeType: string; scopeId: string }> } };

async function request<T>(baseUrl: string, path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('nexgile_access_token');
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const result = await request<LoginResponse>(CORE_API_URL, '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('nexgile_access_token', result.accessToken);
  return result;
}

export async function loadLiveData() {
  const profile = await request<{ id: string; householdId?: string; household?: { id: string } }>(CORE_API_URL, '/auth/me');
  let householdId = profile.householdId || profile.household?.id;
  if (!householdId) {
    const advisorHouseholds = await request<Array<{ id: string }>>(ADVISOR_API_URL, `/advisor/${profile.id}/households`);
    householdId = advisorHouseholds[0]?.id;
  }
  if (!householdId) throw new Error('The authenticated user is not assigned to a household');
  const [household, accounts] = await Promise.all([
    request<any>(CORE_API_URL, `/households/${householdId}`),
    request<any[]>(CORE_API_URL, `/households/${householdId}/accounts`),
  ]);
  const account = accounts[0];
  const [holdings, documents] = await Promise.all([
    account ? request<any[]>(CORE_API_URL, `/accounts/${account.id}/holdings`) : Promise.resolve([]),
    request<any[]>(CORE_API_URL, `/households/${householdId}/documents`),
  ]);
  let taxOpportunities: TaxOpportunity[] = [];
  if (account) {
    try {
      const result = await request<{ value: any[] }>(ADVISOR_API_URL, `/accounts/${account.id}/tax-opportunities`);
      taxOpportunities = result.value.map((item) => ({
        id: item.id, accountId: item.accountId, accountName: account.accountType, taxLotId: item.taxLotId,
        securityTicker: item.ticker, securityName: item.securityName, type: 'harvest_loss',
        quantity: 0, costBasis: 0, currentValue: 0, unrealizedLoss: -Math.abs(item.unrealizedLoss),
        estimatedTaxBenefit: item.estimatedImpact, washSaleRisk: item.washSaleRisk,
        washSaleDetail: item.washSaleReason, suggestedReplacement: '', status: item.status,
      }));
    } catch {
      // Tax scanning is optional; the rest of the live dashboard remains available.
    }
  }
  const mappedHoldings: HoldingItem[] = holdings.map((item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.costBasis);
    const value = quantity * price;
    return {
      id: item.id, ticker: item.security.ticker, name: item.security.name,
      assetClass: item.security.assetClass === 'Cash' ? 'Cash & Equivalents' : item.security.assetClass,
      units: quantity, currentPrice: price, change24h: 0, costBasis: value, marketValue: value,
      portfolioWeight: 0, targetWeight: 0, unrealizedGain: 0, unrealizedGainPercent: 0,
      taxLotMethod: 'FIFO', custodian: account?.custodian?.name || 'Custodian', account: account?.accountType || 'Account',
      lastSyncedAt: item.asOf, source: item.source,
    } as HoldingItem;
  });
  const total = mappedHoldings.reduce((sum, item) => sum + item.marketValue, 0);
  return {
    householdInfo: { householdName: household.name, primaryTrust: household.name, custodian: account?.custodian?.name || 'Custodian', accountNumber: account?.id || '', portfolioType: account?.accountType || 'Portfolio', syncedTimestamp: 'Live data', nextReviewDate: 'Not scheduled' },
    holdings: mappedHoldings.map((item) => ({ ...item, portfolioWeight: total ? (item.marketValue / total) * 100 : 0 })),
    documents: documents.map((doc) => ({ id: doc.id, title: doc.category || 'Fiduciary document', category: doc.category || 'Plan Governance', custodian: account?.custodian?.name || 'Custodian', date: doc.createdAt, fileSize: '—', fileFormat: 'PDF', isEncrypted: true, status: 'Verified' })),
    taxOpportunities,
    metrics: { aggregateNetWorth: total, trustAccountMarketValue: total, totalInvestedCostBasis: total, liquidReserves: 0, unrealizedGainDollar: 0, unrealizedGainPercent: 0, annualDividendIncome: 0, dividendYield: 0, ytdGainDollar: 0, ytdGainPercent: 0 },
  };
}
