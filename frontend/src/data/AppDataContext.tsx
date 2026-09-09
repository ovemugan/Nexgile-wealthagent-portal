import React, { createContext, useContext } from 'react';
import { loadLiveData } from '../api';
import { ASSET_ALLOCATION, HOUSEHOLD_INFO, HOLDINGS_LIST, PORTFOLIO_METRICS, TAX_OPPORTUNITIES, VAULT_DOCUMENTS } from './mockData';

export type AppData = {
  householdInfo: typeof HOUSEHOLD_INFO; holdings: typeof HOLDINGS_LIST; documents: typeof VAULT_DOCUMENTS;
  taxOpportunities: typeof TAX_OPPORTUNITIES; metrics: typeof PORTFOLIO_METRICS; live: boolean;
};
const fallback: AppData = { householdInfo: HOUSEHOLD_INFO, holdings: HOLDINGS_LIST, documents: VAULT_DOCUMENTS, taxOpportunities: TAX_OPPORTUNITIES, metrics: PORTFOLIO_METRICS, live: false };
const AppDataContext = createContext<AppData>(fallback);
export const useAppData = () => useContext(AppDataContext);
export async function fetchAppData() {
  return { ...(await loadLiveData()), live: true } as AppData;
}
export { fallback, ASSET_ALLOCATION };
export const AppDataProvider = AppDataContext.Provider;
