import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { INSTITUTIONAL_PLAN_DATA } from '../../data/mockData';
import {
  Building2,
  Users,
  ShieldCheck,
  FileCheck2,
  Calendar,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
  Percent,
  Info
} from 'lucide-react';

interface RetirementPlanScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const RetirementPlanScreen: React.FC<RetirementPlanScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const [activeTab, setActiveTab] = useState<'sponsor' | 'participant'>('sponsor');
  const plan = INSTITUTIONAL_PLAN_DATA;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Module C & D • Institutional Retirement Plan Administration
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            401(k) Sponsor & Participant Portal
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            {plan.planName} • {plan.planNumber} • ERISA Fiduciary Oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#bbeecf]/50 border border-[#bbeecf] text-xs font-semibold text-[#002112] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
            <span>Form 5500 Certified</span>
          </span>
        </div>
      </div>

      {/* Architectural Callout from Build Plan Step 10 */}
      <div className="p-3.5 rounded-xl bg-[#f5f3ee] border border-[#eae8e3] text-xs text-[#535f73] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#7a5902] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1b1c19]">Information Architecture Specification (Modules C & D):</strong> This portal provides dual institutional perspectives for Plan Sponsors (HR/Benefits Committees, CFOs) and enrolled Employees. The underlying schema models <code>Plan</code>, <code>Sponsor</code>, <code>Participant</code>, <code>Contribution</code>, <code>InvestmentOption</code>, and <code>Filing</code> ready for full recordkeeper ingestion.
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4e2dd] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sponsor')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'sponsor'
              ? 'bg-[#ffffff] text-[#101c2d] border-b-2 border-[#101c2d]'
              : 'text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Plan Sponsor Oversight (Module C)</span>
        </button>

        <button
          onClick={() => setActiveTab('participant')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'participant'
              ? 'bg-[#ffffff] text-[#101c2d] border-b-2 border-[#101c2d]'
              : 'text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Participant Experience & Readiness (Module D)</span>
        </button>
      </div>

      {/* Tab 1: Sponsor Dashboard */}
      {activeTab === 'sponsor' && (
        <div className="space-y-5">
          {/* Bento Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">Total Plan Assets</div>
              <div className="font-serif text-2xl font-bold text-[#1b1c19] mt-1">
                ${(plan.totalPlanAssets / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-[#2F5D45] font-semibold mt-0.5">+8.4% YTD Growth</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">Participation Rate</div>
              <div className="font-serif text-2xl font-bold text-[#1b1c19] mt-1">
                {plan.participationRate}%
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">{plan.activeParticipants} of {plan.eligibleEmployees} employees</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">Average Deferral</div>
              <div className="font-serif text-2xl font-bold text-[#1b1c19] mt-1">
                {plan.averageDeferralRate}%
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Auto-escalation active</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#75777d]">Fiduciary Committee</div>
              <div className="font-serif text-2xl font-bold text-[#2F5D45] mt-1">
                Compliant
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Next Meeting: {plan.nextCommitteeMeeting}</div>
            </div>
          </div>

          {/* Compliance & Regulatory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
                <h3 className="font-serif font-bold text-sm text-[#1b1c19]">
                  ERISA Fiduciary Compliance Matrix
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#2F5D45]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4]">
                  <span className="text-[#535f73]">Form 5500 Annual Filing:</span>
                  <span className="font-semibold text-[#2F5D45]">{plan.form5500Status}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4]">
                  <span className="text-[#535f73]">Employer Matching Formula:</span>
                  <span className="font-semibold text-[#1b1c19]">{plan.employerMatchFormula}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4]">
                  <span className="text-[#535f73]">Investment Lineup Review:</span>
                  <span className="font-semibold text-[#1b1c19]">{plan.investmentOptionsCount} Core Funds (Zero Revenue Share)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4]">
                  <span className="text-[#535f73]">Fiduciary Status:</span>
                  <span className="font-semibold text-[#2F5D45]">3(38) Discretionary Investment Manager</span>
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
                <h3 className="font-serif font-bold text-sm text-[#1b1c19]">
                  Fiduciary Action Items & Calendar
                </h3>
                <Calendar className="w-4 h-4 text-[#75777d]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg border border-[#e4e2dd] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#1b1c19]">Q4 Fiduciary Committee Meeting</div>
                    <div className="text-[11px] text-[#75777d]">Review fee benchmarking & RFP proposals</div>
                  </div>
                  <span className="text-[11px] font-mono text-[#7a5902] font-semibold">Nov 14, 2024</span>
                </div>
                <div className="p-2.5 rounded-lg border border-[#e4e2dd] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#1b1c19]">Annual Fee Disclosure (404a-5)</div>
                    <div className="text-[11px] text-[#75777d]">Direct participant distribution via portal</div>
                  </div>
                  <span className="text-[11px] font-mono text-[#2F5D45] font-semibold">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Participant View */}
      {activeTab === 'participant' && (
        <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0eee9] pb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#75777d]">Enrolled Participant Profile</div>
              <h3 className="font-serif font-bold text-lg text-[#1b1c19] mt-0.5">
                {plan.sampleParticipant.name}
              </h3>
              <p className="text-xs text-[#535f73]">
                Senior VP • Apex Global Technologies Inc. • Fully Vested
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#75777d]">Total 401(k) Balance</span>
              <div className="font-serif text-2xl font-bold text-[#1b1c19]">
                ${plan.sampleParticipant.accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Employee Deferral</div>
              <div className="font-serif text-xl font-bold text-[#1b1c19] mt-1">
                {plan.sampleParticipant.employeeContributionRate}%
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Pre-tax Payroll Deduction</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Company Match</div>
              <div className="font-serif text-xl font-bold text-[#2F5D45] mt-1">
                {plan.sampleParticipant.employerMatchRate}%
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Maximum match captured</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
              <div className="text-[10px] font-bold uppercase text-[#75777d]">Retirement Readiness</div>
              <div className="font-serif text-xl font-bold text-[#2F5D45] mt-1">
                {plan.sampleParticipant.readinessScore}%
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">Projected $14,200/mo income</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
