import React, { useEffect, useState } from 'react';
import { ScreenId, TaxOpportunity } from '../../types';
import { TAX_OPPORTUNITIES, CALCULATION_DISCLOSURES, HOUSEHOLD_INFO } from '../../data/mockData';
import { useAppData } from '../../data/AppDataContext';
import { CalculationDisclosure } from '../CalculationDisclosure';
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  HeartHandshake,
  ArrowRightLeft,
  Sparkles,
  Info,
  DollarSign,
  Landmark
} from 'lucide-react';

interface TaxScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const TaxScreen: React.FC<TaxScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const { taxOpportunities: TAX_OPPORTUNITIES } = useAppData();
  const [opportunities, setOpportunities] = useState<TaxOpportunity[]>(TAX_OPPORTUNITIES);
  useEffect(() => setOpportunities(TAX_OPPORTUNITIES), [TAX_OPPORTUNITIES]);
  const [activeTab, setActiveTab] = useState<'harvesting' | 'gains_budget' | 'philanthropy'>('harvesting');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleActionOpportunity = (id: string, ticker: string, isWashSale: boolean) => {
    if (isWashSale) {
      alert("Wash-Sale Safeguard Warning: This lot has an active wash-sale window under IRC §1091. Proceeding will trigger loss disallowance. Consider swapping into non-substantially identical proxy.");
    }
    
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id ? { ...opp, status: 'actioned' as const } : opp
      )
    );

    setActionSuccessMsg(`Successfully staged tax-action on ${ticker}. Audit event logged.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const totalUnrealizedLosses = opportunities
    .filter(o => o.type === 'harvest_loss')
    .reduce((acc, curr) => acc + Math.abs(curr.unrealizedLoss), 0);

  const totalEstimatedTaxBenefit = opportunities
    .filter(o => o.type === 'harvest_loss' && !o.washSaleRisk)
    .reduce((acc, curr) => acc + curr.estimatedTaxBenefit, 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Module B • Tax Optimization & Fiduciary Shield
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            Tax-Loss Harvesting & Philanthropy
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            Automated IRC §1091 wash-sale detection, capital gains budget, and donor-advised fund governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#f0eee9] border border-[#eae8e3] text-xs font-semibold text-[#1b1c19] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2F5D45]" />
            <span>Wash-Sale Engine Active</span>
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 rounded-xl bg-[#bbeecf]/50 border border-[#bbeecf] text-xs text-[#002112] font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F5D45]" />
            <span>{actionSuccessMsg}</span>
          </div>
          <span className="text-[10px] font-mono text-[#2F5D45]">AuditEvent #AUD-110 Written</span>
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d] flex items-center justify-between">
            <span>Harvestable Gross Losses</span>
            <TrendingDown className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#1b1c19] mt-1">
            ${totalUnrealizedLosses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#535f73] mt-0.5">
            Across 2 custodial tax-lots
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d] flex items-center justify-between">
            <span>Estimated Net Tax Alpha</span>
            <DollarSign className="w-4 h-4 text-[#2F5D45]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#2F5D45] mt-1">
            +${totalEstimatedTaxBenefit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#535f73] mt-0.5">
            Offsetting 40.8% combined top federal + NIIT
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d] flex items-center justify-between">
            <span>IRC §1091 Wash-Sale Risk</span>
            <AlertTriangle className="w-4 h-4 text-[#7a5902]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#7a5902] mt-1">
            1 Lot Flagged
          </div>
          <div className="text-[11px] text-[#535f73] mt-0.5">
            Recent buy transaction within ±30-day window
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4e2dd] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('harvesting')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'harvesting'
              ? 'bg-[#ffffff] text-[#101c2d] border-b-2 border-[#101c2d]'
              : 'text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Tax-Loss Harvesting Opportunities</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#eae8e3] font-mono">
            {opportunities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gains_budget')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'gains_budget'
              ? 'bg-[#ffffff] text-[#101c2d] border-b-2 border-[#101c2d]'
              : 'text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Capital Gains Realization Budget</span>
        </button>

        <button
          onClick={() => setActiveTab('philanthropy')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'philanthropy'
              ? 'bg-[#ffffff] text-[#101c2d] border-b-2 border-[#101c2d]'
              : 'text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Donor-Advised Fund (DAF) & Giving</span>
        </button>
      </div>

      {/* Tab 1: Tax-Loss Harvesting Candidates */}
      {activeTab === 'harvesting' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] overflow-hidden shadow-xs divide-y divide-[#f0eee9]">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-4 sm:p-5 hover:bg-[#fbf9f4] transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Ticker, name, and lot */}
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#101c2d]">
                        {opp.securityTicker}
                      </span>
                      <span className="font-semibold text-xs text-[#1b1c19]">
                        {opp.securityName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f0eee9] text-[#535f73]">
                        Lot: {opp.taxLotId}
                      </span>
                      {opp.washSaleRisk ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Wash-Sale Risk Flagged (IRC §1091)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#bbeecf] text-[#002112] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Clean Loss Harvest Eligible
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#535f73]">
                      Account: <span className="font-medium text-[#1b1c19]">{opp.accountName}</span> • Units: {opp.quantity.toLocaleString()} • Cost Basis: ${opp.costBasis.toLocaleString()} • Current Value: ${opp.currentValue.toLocaleString()}
                    </div>

                    {/* Wash-sale or eligibility detail description */}
                    <div className={`text-xs p-2.5 rounded-lg border mt-2 ${
                      opp.washSaleRisk
                        ? 'bg-[#fff8f6] border-[#ffdad6] text-[#93000a]'
                        : 'bg-[#f5fbf7] border-[#bbeecf] text-[#002112]'
                    }`}>
                      <div className="font-medium">{opp.washSaleDetail}</div>
                      <div className="mt-1 text-[11px] text-[#535f73] flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3 text-[#7a5902]" />
                        <span>Recommended Swap Proxy: <strong>{opp.suggestedReplacement}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Numbers and Action button */}
                  <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] text-[#75777d] uppercase font-medium">Unrealized Capital Loss</div>
                      <div className="font-mono text-base font-bold text-[#ba1a1a]">
                        ${opp.unrealizedLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-[#2F5D45] font-medium">
                        Tax Benefit: +${opp.estimatedTaxBenefit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div>
                      {opp.status === 'actioned' ? (
                        <span className="px-3 py-1.5 rounded-lg bg-[#f0eee9] text-xs font-semibold text-[#535f73] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
                          <span>Action Staged & Logged</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleActionOpportunity(opp.id, opp.securityTicker, opp.washSaleRisk)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            opp.washSaleRisk
                              ? 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab]'
                              : 'bg-[#101c2d] text-[#ffffff] hover:bg-[#1b2a41]'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{opp.washSaleRisk ? 'Review Proxy Swap' : 'Harvest Loss'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Section 5 Shared Contract Metadata */}
          <CalculationDisclosure
            asOf={CALCULATION_DISCLOSURES.taxLossHarvesting.asOf}
            method={CALCULATION_DISCLOSURES.taxLossHarvesting.method}
            assumptions={CALCULATION_DISCLOSURES.taxLossHarvesting.assumptions}
            limitations={CALCULATION_DISCLOSURES.taxLossHarvesting.limitations}
            computedAt={CALCULATION_DISCLOSURES.taxLossHarvesting.computedAt}
          />
        </div>
      )}

      {/* Tab 2: Capital Gains Realization Budget */}
      {activeTab === 'gains_budget' && (
        <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-5 shadow-xs">
          <div>
            <h3 className="font-serif font-bold text-base text-[#1b1c19]">
              2024 Household Capital Gains Realization Budget
            </h3>
            <p className="text-xs text-[#535f73]">
              Target maximum capital gain threshold established in the Sterling Investment Policy Statement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Annual Realization Ceiling</div>
              <div className="font-serif text-xl font-bold text-[#1b1c19] mt-1">$45,000.00</div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Agreed target with CPA</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Realized YTD Capital Gains</div>
              <div className="font-serif text-xl font-bold text-[#ba1a1a] mt-1">$18,420.00</div>
              <div className="text-[11px] text-[#535f73] mt-0.5">40.9% of annual allowance used</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Remaining Gain Capacity</div>
              <div className="font-serif text-xl font-bold text-[#2F5D45] mt-1">$26,580.00</div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Capacity before bracket escalation</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f3ee] border border-[#eae8e3] text-xs text-[#535f73] space-y-1">
            <div className="font-semibold text-[#1b1c19]">Tax Budgeting Guidance</div>
            <p>
              Rebalancing directive RP-2024-09 will realize $12,270.00 in long-term capital gains, leaving $14,310.00 in reserve for unexpected fourth-quarter mutual fund capital gains distributions from JPLG.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: DAF & Philanthropy */}
      {activeTab === 'philanthropy' && (
        <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1b1c19]">
                Sterling Family Charitable Donor-Advised Fund (DAF)
              </h3>
              <p className="text-xs text-[#535f73]">
                Managed in partnership with the National Philanthropic Trust • Tax-exempt 501(c)(3) vehicle
              </p>
            </div>
            <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#bbeecf] text-[#002112]">
              DAF-881920-ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Total DAF Balance</div>
              <div className="font-serif text-xl font-bold text-[#1b1c19] mt-1">$350,000.00</div>
              <div className="text-[11px] text-[#2F5D45] mt-0.5">Invested in ESG Growth Model</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">2024 Grants Disbursed</div>
              <div className="font-serif text-xl font-bold text-[#7a5902] mt-1">$45,000.00</div>
              <div className="text-[11px] text-[#535f73] mt-0.5">3 accredited non-profits</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Appreciated Stock Donated</div>
              <div className="font-serif text-xl font-bold text-[#2F5D45] mt-1">$30,000.00</div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Zero capital gains on gift</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#1b1c19]">Recent Grant Recommendations</div>
            <div className="divide-y divide-[#eae8e3] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1b1c19]">Yale School of Medicine Oncology Research</div>
                  <div className="text-[11px] text-[#75777d]">Grant ID: GR-9012 • Disbursed Aug 2024</div>
                </div>
                <div className="font-serif font-bold text-[#1b1c19]">$25,000.00</div>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1b1c19]">Lincoln Center for the Performing Arts</div>
                  <div className="text-[11px] text-[#75777d]">Grant ID: GR-8841 • Disbursed May 2024</div>
                </div>
                <div className="font-serif font-bold text-[#1b1c19]">$20,000.00</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
