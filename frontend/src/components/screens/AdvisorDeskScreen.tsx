import React, { useState } from 'react';
import { ScreenId, AdvisorClientHousehold } from '../../types';
import { ADVISOR_BOOK_OF_BUSINESS, HOUSEHOLD_INFO } from '../../data/mockData';
import { BrandedReportModal } from '../BrandedReportModal';
import {
  Briefcase,
  Users,
  AlertCircle,
  TrendingUp,
  FileText,
  Scale,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ExternalLink
} from 'lucide-react';

interface AdvisorDeskScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const AdvisorDeskScreen: React.FC<AdvisorDeskScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('hh-1');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [riskAnswers, setRiskAnswers] = useState<Record<number, number>>({
    1: 4, // Time horizon: 10+ years
    2: 4, // Drop tolerance: Buy more / Hold
    3: 3, // Liquidity need: Moderate
    4: 4, // Primary goal: Capital Growth
  });

  const selectedHousehold =
    ADVISOR_BOOK_OF_BUSINESS.find((h) => h.id === selectedHouseholdId) ||
    ADVISOR_BOOK_OF_BUSINESS[0];

  const totalBookAUM = ADVISOR_BOOK_OF_BUSINESS.reduce((acc, h) => acc + h.totalAUM, 0);

  // Compute weighted risk score (0 - 100)
  const sumScores = (Object.values(riskAnswers) as number[]).reduce((a, b) => a + b, 0);
  const currentRiskScore = Math.round(sumScores * 6.25);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Module E • Fiduciary Advisor Workstation
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            Advisor Book of Business & Client-360
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            Managing Advisor: {HOUSEHOLD_INFO.advisorName} • AdvisorTeam:45 • Mandate Scoped
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#101c2d] hover:bg-[#1b2a41] text-xs font-semibold text-[#ffffff] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#ffdea4]" />
            <span>Generate Branded Client PDF</span>
          </button>
        </div>
      </div>

      {/* Book Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">
            Total Book AUM
          </div>
          <div className="font-serif text-2xl font-bold text-[#1b1c19] mt-1">
            ${(totalBookAUM / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-[#2F5D45] font-semibold mt-0.5">
            Across 3 Seeded Households
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">
            Drift Breaches
          </div>
          <div className="font-serif text-2xl font-bold text-[#ba1a1a] mt-1">
            1 Household
          </div>
          <div className="text-[11px] text-[#535f73] mt-0.5">
            The Sterling Household (+4.2% US Eq)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">
            Pending Directives
          </div>
          <div className="font-serif text-2xl font-bold text-[#7a5902] mt-1">
            RP-2024-09
          </div>
          <div className="text-[11px] text-[#535f73] mt-0.5">
            Awaiting client dual-signature
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">
            Tax Harvest Queue
          </div>
          <div className="font-serif text-2xl font-bold text-[#1b1c19] mt-1">
            7 Open Lots
          </div>
          <div className="text-[11px] text-[#535f73] mt-0.5">
            1 Wash-Sale Filtered (IRC §1091)
          </div>
        </div>
      </div>

      {/* Book of Business Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#e4e2dd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#75777d]" />
            <h2 className="font-serif font-bold text-sm text-[#1b1c19]">
              Assigned Client Households (Scope: AdvisorTeam:45)
            </h2>
          </div>
          <span className="text-xs text-[#75777d]">
            Multi-Tenant Role Enforcement Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#fbf9f4] border-b border-[#e4e2dd] text-[10px] uppercase font-bold text-[#75777d]">
                <th className="p-3.5">Household & Contact</th>
                <th className="p-3.5 text-right">Total AUM</th>
                <th className="p-3.5 text-center">Accounts</th>
                <th className="p-3.5">Risk Mandate</th>
                <th className="p-3.5">Rebalance Stance</th>
                <th className="p-3.5 text-center">Tax Opps</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee9]">
              {ADVISOR_BOOK_OF_BUSINESS.map((hh) => {
                const isSelected = hh.id === selectedHouseholdId;
                return (
                  <tr
                    key={hh.id}
                    onClick={() => setSelectedHouseholdId(hh.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#f5f3ee]' : 'hover:bg-[#fbf9f4]'
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-serif font-bold text-xs text-[#1b1c19]">
                        {hh.householdName}
                      </div>
                      <div className="text-[11px] text-[#75777d]">
                        {hh.primaryContact}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#1b1c19]">
                      ${hh.totalAUM.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-center font-mono text-[#535f73]">
                      {hh.accountsCount}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-[#1b1c19]">{hh.riskCategory}</div>
                      <div className="text-[10px] text-[#75777d] font-mono">Score: {hh.riskScore}/100</div>
                    </td>
                    <td className="p-3.5">
                      {hh.driftBreach ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3" />
                          Drift Breach (+4.2%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#bbeecf] text-[#002112] w-fit">
                          Within Tolerance
                        </span>
                      )}
                      <div className="text-[10px] text-[#535f73] mt-0.5">
                        {hh.pendingRebalanceStatus}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono font-semibold text-[#7a5902]">
                      {hh.openTaxOpportunities}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hh.id === 'hh-1') {
                            onNavigate('rebalance');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#f0eee9] hover:bg-[#101c2d] hover:text-[#ffffff] text-[11px] font-semibold text-[#1b1c19] transition-all"
                      >
                        {hh.id === 'hh-1' ? 'Review Directive' : 'View Ledger'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client 360 Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Risk Questionnaire & Efficient Frontier */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1b1c19]">
                Fiduciary Risk Profiler & Scoring Tool (Step 4)
              </h3>
              <p className="text-[11px] text-[#75777d]">
                Evaluating {selectedHousehold.householdName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-bold text-[#75777d]">Risk Score</span>
              <div className="font-serif text-xl font-bold text-[#101c2d]">
                {currentRiskScore} / 100
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-[#1b1c19]">1. Investment Time Horizon</label>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[
                  { label: '<3 Yrs', val: 1 },
                  { label: '3-5 Yrs', val: 2 },
                  { label: '5-10 Yrs', val: 3 },
                  { label: '10+ Yrs', val: 4 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setRiskAnswers(prev => ({ ...prev, 1: item.val }))}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border text-[11px] transition-all ${
                      riskAnswers[1] === item.val
                        ? 'bg-[#101c2d] text-[#ffffff] border-[#101c2d]'
                        : 'bg-[#fbf9f4] border-[#eae8e3] text-[#535f73] hover:bg-[#f0eee9]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-medium text-[#1b1c19]">2. Reaction to 20% Portfolio Drawdown</label>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[
                  { label: 'Sell All', val: 1 },
                  { label: 'Trim Risk', val: 2 },
                  { label: 'Hold Firm', val: 3 },
                  { label: 'Buy More', val: 4 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setRiskAnswers(prev => ({ ...prev, 2: item.val }))}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border text-[11px] transition-all ${
                      riskAnswers[2] === item.val
                        ? 'bg-[#101c2d] text-[#ffffff] border-[#101c2d]'
                        : 'bg-[#fbf9f4] border-[#eae8e3] text-[#535f73] hover:bg-[#f0eee9]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-medium text-[#1b1c19]">3. Liquidity Need over Next 24 Months</label>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[
                  { label: 'High >25%', val: 1 },
                  { label: 'Med 15%', val: 2 },
                  { label: 'Low 5%', val: 3 },
                  { label: 'Zero', val: 4 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setRiskAnswers(prev => ({ ...prev, 3: item.val }))}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border text-[11px] transition-all ${
                      riskAnswers[3] === item.val
                        ? 'bg-[#101c2d] text-[#ffffff] border-[#101c2d]'
                        : 'bg-[#fbf9f4] border-[#eae8e3] text-[#535f73] hover:bg-[#f0eee9]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Efficient Frontier Visual Preview */}
          <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3] text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#1b1c19]">Efficient Frontier Stance:</span>
              <span className="font-mono font-bold text-[#2F5D45]">
                {currentRiskScore >= 75 ? 'Capital Appreciation (Target 42% Eq)' : 'Moderate Balanced (Target 35% Eq)'}
              </span>
            </div>
            <p className="text-[11px] text-[#535f73]">
              Output formatted per <code>CalculationResult&lt;RiskScore&gt;</code> with method <code>weighted_questionnaire_v1</code>.
            </p>
          </div>
        </div>

        {/* Quick Advisor Actions & Compliance Attestations */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#1b1c19]">
                Active Directives & Workflows (Step 6 & 8)
              </h3>
              <span className="text-[11px] font-mono text-[#75777d]">RP-2024-09</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1b1c19]">Fiduciary Rebalance RP-2024-09</div>
                  <div className="text-[11px] text-[#535f73]">Cures US Equity +4.2% variance breach</div>
                </div>
                <button
                  onClick={() => onNavigate('rebalance')}
                  className="px-3 py-1.5 rounded-lg bg-[#101c2d] text-[#ffffff] text-xs font-semibold hover:bg-[#1b2a41] flex items-center gap-1"
                >
                  <span>Open Protocol</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1b1c19]">Tax Opportunity Queue</div>
                  <div className="text-[11px] text-[#535f73]">2 lots harvestable • 1 wash-sale warning</div>
                </div>
                <button
                  onClick={() => onNavigate('tax')}
                  className="px-3 py-1.5 rounded-lg bg-[#f0eee9] text-[#1b1c19] text-xs font-semibold hover:bg-[#eae8e3] flex items-center gap-1"
                >
                  <span>Review Taxes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1b1c19]">Fiduciary Document Vault</div>
                  <div className="text-[11px] text-[#535f73]">2023 Form 1099-B, Restated Trust Instrument</div>
                </div>
                <button
                  onClick={() => onNavigate('vault')}
                  className="px-3 py-1.5 rounded-lg bg-[#f0eee9] text-[#1b1c19] text-xs font-semibold hover:bg-[#eae8e3] flex items-center gap-1"
                >
                  <span>Access Vault</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0eee9]">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#101c2d] hover:bg-[#1b2a41] text-[#ffffff] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <FileText className="w-4 h-4 text-[#ffdea4]" />
              <span>Launch Client-Branded Fiduciary Report Generator</span>
            </button>
          </div>
        </div>

      </div>

      {/* Branded Report Modal */}
      <BrandedReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
};
