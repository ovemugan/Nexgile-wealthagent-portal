import React, { useRef } from 'react';
import { HOUSEHOLD_INFO, PORTFOLIO_METRICS, HOLDINGS_LIST, ASSET_ALLOCATION } from '../data/mockData';
import { Printer, Download, X, ShieldCheck, CheckCircle2, FileText, Lock } from 'lucide-react';

interface BrandedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandedReportModal: React.FC<BrandedReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#ffffff] rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-[#e4e2dd] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Toolbar */}
        <div className="p-4 bg-[#101c2d] text-[#ffffff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ffdea4]" />
            <div>
              <h2 className="font-serif font-bold text-sm sm:text-base leading-tight">
                Fiduciary Portfolio Review & Allocation Attestation
              </h2>
              <p className="text-[11px] text-[#bbc7de]">
                Prepared by {HOUSEHOLD_INFO.advisorFirm} • Client Copy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#ffffff]/10 hover:bg-[#ffffff]/20 text-xs font-semibold text-[#ffffff] transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#ffffff]/10 text-[#bbc7de] hover:text-[#ffffff] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#ffffff] text-[#1b1c19] text-xs font-sans">
          
          {/* Document Header */}
          <div className="border-b border-[#101c2d] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight text-[#101c2d]">
                NEXGILE SOVEREIGN ADVISORY
              </div>
              <div className="text-[11px] text-[#535f73] mt-0.5">
                SEC Registered Investment Advisor • Private Wealth & Family Office Division
              </div>
              <div className="text-[11px] text-[#75777d]">
                590 Madison Avenue, 28th Floor, New York, NY 10022
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#75777d]">
                Report Date: October 04, 2024
              </div>
              <div className="font-mono text-xs font-bold text-[#1b1c19] mt-0.5">
                REF: RPT-2024-Q3-STRL
              </div>
              <div className="text-[11px] text-[#2F5D45] flex items-center sm:justify-end gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Fiduciary Audit</span>
              </div>
            </div>
          </div>

          {/* Client & Household Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fbf9f4] border border-[#eae8e3]">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#75777d] tracking-wider">
                Client Entity
              </div>
              <div className="font-serif text-base font-bold text-[#1b1c19] mt-0.5">
                {HOUSEHOLD_INFO.householdName}
              </div>
              <div className="text-xs text-[#44474c] mt-0.5">
                {HOUSEHOLD_INFO.primaryTrust}
              </div>
              <div className="font-mono text-[11px] text-[#75777d] mt-1">
                Account ID: {HOUSEHOLD_INFO.accountNumber} ({HOUSEHOLD_INFO.custodian})
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-[#75777d] tracking-wider">
                Advisory Team & Custody
              </div>
              <div className="font-semibold text-xs text-[#1b1c19] mt-0.5">
                Lead Advisor: {HOUSEHOLD_INFO.advisorName}
              </div>
              <div className="text-[11px] text-[#535f73]">
                Fiduciary Attestation: {HOUSEHOLD_INFO.fiduciaryAttestationBy}
              </div>
              <div className="text-[11px] text-[#535f73] mt-1">
                Dual Custodial Channel: J.P. Morgan PB / BNY Mellon
              </div>
            </div>
          </div>

          {/* Executive Portfolio Summary */}
          <div>
            <h3 className="font-serif font-bold text-sm text-[#101c2d] uppercase tracking-wider mb-3">
              Consolidated Balance & Performance Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
                <div className="text-[10px] text-[#75777d] uppercase font-semibold">Total Aggregate Net Worth</div>
                <div className="font-serif text-lg font-bold text-[#101c2d] mt-1">
                  ${PORTFOLIO_METRICS.aggregateNetWorth.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#2F5D45] font-semibold mt-0.5">+3.45% YTD</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
                <div className="text-[10px] text-[#75777d] uppercase font-semibold">Unrealized Capital Gain</div>
                <div className="font-serif text-lg font-bold text-[#2F5D45] mt-1">
                  +${PORTFOLIO_METRICS.unrealizedGainDollar.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#535f73] mt-0.5">Cost Basis: $2,190,000</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
                <div className="text-[10px] text-[#75777d] uppercase font-semibold">Annual Projected Income</div>
                <div className="font-serif text-lg font-bold text-[#1b1c19] mt-1">
                  ${PORTFOLIO_METRICS.annualDividendIncome.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#7a5902] font-semibold mt-0.5">2.20% Net Yield</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
                <div className="text-[10px] text-[#75777d] uppercase font-semibold">Liquid Cash Reserves</div>
                <div className="font-serif text-lg font-bold text-[#1b1c19] mt-1">
                  ${PORTFOLIO_METRICS.liquidReserves.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#75777d] mt-0.5">Immediate Liquidity</div>
              </div>
            </div>
          </div>

          {/* Asset Allocation Matrix */}
          <div>
            <h3 className="font-serif font-bold text-sm text-[#101c2d] uppercase tracking-wider mb-2">
              Strategic Asset Allocation & Policy Drift
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1b1c19] text-[10px] uppercase font-bold text-[#75777d]">
                  <th className="py-2">Asset Class</th>
                  <th className="py-2 text-right">Current Weight</th>
                  <th className="py-2 text-right">Target Policy</th>
                  <th className="py-2 text-right">Variance / Drift</th>
                  <th className="py-2 text-right">Market Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e3]">
                {ASSET_ALLOCATION.map((item) => (
                  <tr key={item.name} className="py-2">
                    <td className="py-2 font-medium text-[#1b1c19]">{item.name}</td>
                    <td className="py-2 text-right font-mono">{item.percentage}%</td>
                    <td className="py-2 text-right font-mono text-[#535f73]">{item.targetPercentage}%</td>
                    <td className={`py-2 text-right font-mono font-semibold ${
                      item.drift > 2 ? 'text-[#ba1a1a]' : item.drift < -1 ? 'text-[#7a5902]' : 'text-[#2F5D45]'
                    }`}>
                      {item.drift > 0 ? `+${item.drift}%` : `${item.drift}%`}
                    </td>
                    <td className="py-2 text-right font-mono font-medium">${item.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Primary Custodial Holdings Extract */}
          <div>
            <h3 className="font-serif font-bold text-sm text-[#101c2d] uppercase tracking-wider mb-2">
              Sample Core Holdings Ledger (Excerpt)
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1b1c19] text-[10px] uppercase font-bold text-[#75777d]">
                  <th className="py-2">Ticker</th>
                  <th className="py-2">Security Description</th>
                  <th className="py-2 text-right">Units</th>
                  <th className="py-2 text-right">Market Value</th>
                  <th className="py-2 text-right">Unrealized P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e3]">
                {HOLDINGS_LIST.slice(0, 5).map((h) => (
                  <tr key={h.id}>
                    <td className="py-2 font-mono font-bold text-[#101c2d]">{h.ticker}</td>
                    <td className="py-2 text-[#44474c]">{h.name}</td>
                    <td className="py-2 text-right font-mono">{h.units.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono font-medium">${h.marketValue.toLocaleString()}</td>
                    <td className={`py-2 text-right font-mono font-semibold ${
                      h.unrealizedGain >= 0 ? 'text-[#2F5D45]' : 'text-[#ba1a1a]'
                    }`}>
                      {h.unrealizedGain >= 0 ? `+$${h.unrealizedGain.toLocaleString()}` : `-$${Math.abs(h.unrealizedGain).toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fiduciary Attestation & Signature Box */}
          <div className="pt-6 border-t border-[#101c2d] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#75777d]">
                Advisor Certification
              </div>
              <p className="text-[11px] text-[#535f73] leading-relaxed">
                I hereby attest that this portfolio review reflects actual custodial positions and complies with the Investment Advisers Act of 1940 and the Investment Policy Statement established for the Sterling Family Trust.
              </p>
              <div className="pt-3">
                <div className="font-serif italic text-sm font-bold text-[#101c2d]">
                  Arthur Montgomery, CFA
                </div>
                <div className="text-[10px] text-[#75777d]">
                  Managing Director, Nexgile Sovereign Advisory
                </div>
              </div>
            </div>

            <div className="space-y-1 sm:text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#75777d]">
                Chief Compliance Officer Seal
              </div>
              <p className="text-[11px] text-[#535f73] leading-relaxed">
                Reviewed under SEC Rule 206(4)-2 Custody Safeguards. Direct verification from J.P. Morgan PB and BNY Mellon omnibus accounts.
              </p>
              <div className="pt-3 flex sm:justify-end items-center gap-1 text-[#2F5D45] font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Sealed & Immutable</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f5f3ee] border-t border-[#eae8e3] flex items-center justify-between">
          <span className="text-[11px] text-[#75777d]">
            Generated by Nexgile-WealthAgent v2.4 • Confidential Client Fiduciary Material
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#101c2d] text-[#ffffff] text-xs font-semibold hover:bg-[#1b2a41] transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
