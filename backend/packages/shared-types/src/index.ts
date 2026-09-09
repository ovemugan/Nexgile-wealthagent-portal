export interface CalculationResult<T> {
  value: T;
  asOf: string;
  method: string;
  assumptions: Record<string, string | number>;
  limitations: string[];
  computedAt: string;
}

export interface AccountSummary { id: string; accountType: string; custodian: string; value: number; lastSyncedAt?: string; }
export interface HouseholdSummary { id: string; name: string; netWorth: number; accounts: AccountSummary[]; }
