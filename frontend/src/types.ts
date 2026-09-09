export type ScreenId = 
  | 'overview' 
  | 'holdings' 
  | 'scenarios' 
  | 'rebalance' 
  | 'tax' 
  | 'advisor_desk' 
  | 'vault' 
  | 'retirement_plans' 
  | 'audit_log';

export type UserRole = 'client' | 'advisor' | 'sponsor' | 'compliance';

// Section 5 of Build Plan: Shared CalculationResult contract
export interface CalculationResult<T> {
  value: T;
  asOf: string; // ISO date of the data snapshot used
  method: string; // e.g. "compound_growth_deterministic", "monte_carlo_random_walk"
  assumptions: Record<string, string | number>;
  limitations: string[]; // plain-English caveats to show in the UI
  computedAt: string; // ISO timestamp
}

export interface HoldingItem {
  id: string;
  ticker: string;
  name: string;
  assetClass: 'US Equities' | 'Global Equities' | 'Fixed Income' | 'Alternatives' | 'Cash & Equivalents';
  units: number;
  currentPrice: number;
  change24h: number;
  costBasis: number;
  marketValue: number;
  portfolioWeight: number;
  targetWeight: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  taxLotMethod: string;
  custodian: string;
  account: string;
  lastSyncedAt?: string;
  source?: string;
}

export interface AssetAllocationCategory {
  name: string;
  percentage: number;
  targetPercentage: number;
  value: number;
  color: string;
  lightBg: string;
  textColor: string;
  drift: number; // positive = overweight, negative = underweight
}

export interface RebalanceOrder {
  id: string;
  ticker: string;
  name: string;
  action: 'SELL' | 'BUY';
  shares: number;
  limitPrice: number;
  estimatedValue: number;
  taxLotMethod: string;
  realizedGainLoss: number;
  taxCategory: 'Long-term Capital Gain' | 'Neutral Reinvestment' | 'Short-term Capital Gain';
  rationale: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: 'Tax Document' | 'Trust Agreement' | 'Fiduciary Letter' | 'Custody Report' | 'Plan Governance';
  custodian: string;
  date: string;
  fileSize: string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX';
  isEncrypted: boolean;
  status: 'Verified' | 'Pending Review' | 'Archived';
  version?: number;
}

export interface ScenarioParams {
  retirementAge: number;
  monthlyInflow: number;
  annualDrawdown: number;
  expectedGrossReturn: number;
  coreInflationIndex: number;
  stressGFC: boolean;
  stressStagflation: boolean;
  stressTechCrash: boolean;
}

// Module B: Tax-Loss Harvesting and Wash-Sale Detection (Section 6 & 7)
export interface TaxOpportunity {
  id: string;
  accountId: string;
  accountName: string;
  taxLotId: string;
  securityTicker: string;
  securityName: string;
  type: 'harvest_loss' | 'roth_conversion' | 'rmd_due';
  quantity: number;
  costBasis: number;
  currentValue: number;
  unrealizedLoss: number;
  estimatedTaxBenefit: number;
  washSaleRisk: boolean; // Flagged if security traded within ±30 days (IRC §1091)
  washSaleDetail?: string;
  suggestedReplacement: string;
  status: 'open' | 'actioned' | 'dismissed';
}

// Section 5 & 7: Audit Event for compliance and dual-control operations
export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  entityType: 'RebalancingProposal' | 'TaxOpportunity' | 'Goal' | 'Account' | 'Document';
  entityId: string;
  action: 'CREATE' | 'APPROVE' | 'REJECT' | 'ACTION' | 'SIGN';
  details: string;
  before?: any;
  after?: any;
  createdAt: string;
}

// Module E: Advisor Book-of-Business Client-360 item
export interface AdvisorClientHousehold {
  id: string;
  householdName: string;
  primaryContact: string;
  totalAUM: number;
  accountsCount: number;
  riskCategory: 'Conservative' | 'Moderate Growth' | 'Capital Appreciation' | 'Aggressive';
  riskScore: number;
  lastReviewDate: string;
  openTaxOpportunities: number;
  pendingRebalanceStatus: 'None' | 'Draft' | 'Pending Client Signature' | 'Executed';
  driftBreach: boolean;
}
