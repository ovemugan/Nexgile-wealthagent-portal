import React, { useState } from 'react';
import { ScreenId } from '../../types';
import {
  HOUSEHOLD_INFO,
  REBALANCE_ORDERS,
  REBALANCE_SUMMARY,
  ASSET_ALLOCATION,
  CALCULATION_DISCLOSURES,
} from '../../data/mockData';
import { CalculationDisclosure } from '../CalculationDisclosure';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface RebalanceScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const RebalanceScreen: React.FC<RebalanceScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const [orders, setOrders] = useState(REBALANCE_ORDERS);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'staging' | 'approved' | 'declined'>('pending');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatCurrencyFull = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleApprove = () => {
    setApprovalStatus('staging');
    setShowConfirmationModal(false);
    setTimeout(() => {
      setApprovalStatus('approved');
    }, 1200);
  };

  const handleDecline = () => {
    setApprovalStatus('declined');
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Directive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e4e2dd]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#fcce73] text-[#775600]">
              Directive {REBALANCE_SUMMARY.directiveId}
            </span>
            <span className="text-xs text-[#75777d]">
              Fiduciary Supervision • {HOUSEHOLD_INFO.advisorName}
            </span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-1">
            {REBALANCE_SUMMARY.cycleTitle}
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            Channel: {REBALANCE_SUMMARY.custodianChannel} • Discretionary Tax Optimization
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {approvalStatus === 'pending' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffdea4] text-[#5d4200] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#7a5902] animate-ping" />
              <span>Awaiting Household Execution</span>
            </div>
          )}
          {approvalStatus === 'staging' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c2d] text-[#ffffff] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#fcce73] animate-spin" />
              <span>Staging Orders to Custodian...</span>
            </div>
          )}
          {approvalStatus === 'approved' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#bbeecf] text-[#002112] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#2F5D45]" />
              <span>Staged & Queued for Market Open</span>
            </div>
          )}
          {approvalStatus === 'declined' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold">
              <span>Proposal Returned to Advisor</span>
            </div>
          )}
        </div>
      </div>

      {/* Variance Breach Diagnostic & Advisory Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Advisory Rationale (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eee9]">
            <h2 className="font-serif text-base font-bold text-[#1b1c19]">
              Fiduciary Review Note & Rationale
            </h2>
            <span className="text-[11px] text-[#75777d]">Arthur Montgomery, CFA</span>
          </div>

          <p className="text-xs text-[#44474c] mt-3 leading-relaxed">
            Equity market outperformance (+18.4% YTD) has caused consolidated equities to drift to <strong>46.2%</strong> of the portfolio, surpassing the <strong>42.0%</strong> maximum threshold specified in the Sterling Family Investment Policy Statement.
          </p>

          <p className="text-xs text-[#44474c] mt-2 leading-relaxed">
            This rebalance protocol harvests gains in high-beta equity tranches (specifically utilizing Specific Identification MinTax lot selection on AAPL and HIFO on VUG to minimize capital gains exposure) and redeploys proceeds dollar-for-dollar into sovereign core fixed income (AGG) and 5.25% short-term Treasury bills (SGOV).
          </p>

          <div className="mt-4 p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3] flex items-center justify-between text-xs">
            <span className="text-[#535f73]">Policy Remedy Target:</span>
            <span className="font-bold text-[#2F5D45]">Equities 42.0% • Fixed Income 30.0% (Zero Cash Drag)</span>
          </div>
        </div>

        {/* Right: Portfolio Architecture Comparison (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1b1c19]">
              Portfolio Stance Re-alignment
            </h3>
            <p className="text-xs text-[#75777d] mt-0.5">
              Before vs. After Proposed Directive
            </p>

            <div className="mt-4 space-y-4">
              
              {/* Current Stance Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1b1c19] mb-1">
                  <span>Current Stance (Equities Overweight)</span>
                  <span className="text-[#ba1a1a]">46.2% Equities (+4.2% breach)</span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-[#eae8e3] flex overflow-hidden">
                  <div style={{ width: '46.2%' }} className="bg-[#ba1a1a]" title="Equities 46.2%" />
                  <div style={{ width: '28.5%' }} className="bg-[#7a5902]" title="Fixed Income 28.5%" />
                  <div style={{ width: '14.1%' }} className="bg-[#2F5D45]" title="Global 14.1%" />
                  <div style={{ width: '11.2%' }} className="bg-[#535f73]" title="Alts & Cash 11.2%" />
                </div>
              </div>

              {/* Target Model Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1b1c19] mb-1">
                  <span>Target Stance (Restored Mandate)</span>
                  <span className="text-[#2F5D45]">42.0% Equities (Compliant)</span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-[#eae8e3] flex overflow-hidden">
                  <div style={{ width: '42.0%' }} className="bg-[#101c2d]" title="Equities 42.0%" />
                  <div style={{ width: '30.0%' }} className="bg-[#7a5902]" title="Fixed Income 30.0%" />
                  <div style={{ width: '15.0%' }} className="bg-[#2F5D45]" title="Global 15.0%" />
                  <div style={{ width: '13.0%' }} className="bg-[#535f73]" title="Alts & Cash 13.0%" />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs text-[#535f73]">
            <span>Net Variance Remediation</span>
            <span className="font-bold text-[#2F5D45]">100% Resolved</span>
          </div>
        </div>

      </div>

      {/* Proposed Execution Ledger */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] overflow-hidden shadow-xs">
        
        <div className="p-4 border-b border-[#e4e2dd] bg-[#f5f3ee] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1b1c19]">
              Proposed Execution Ledger (4 Staged Orders)
            </h2>
            <p className="text-xs text-[#75777d] mt-0.5">
              Specific Identification lot methods to optimize tax realization
            </p>
          </div>
          <button
            onClick={() => onNavigate('vault')}
            className="flex items-center gap-1 text-xs text-[#101c2d] font-semibold hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Execution Memo PDF</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbf9f4] text-[#535f73] font-semibold border-b border-[#e4e2dd]">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-3">Asset & Ticker</th>
                <th className="py-3 px-3">Tax Lot Selection</th>
                <th className="py-3 px-3 text-right">Shares</th>
                <th className="py-3 px-3 text-right">Limit Price</th>
                <th className="py-3 px-4 text-right">Estimated Value</th>
                <th className="py-3 px-4 text-right">Realized Gain/Loss</th>
                <th className="py-3 px-4">Tax Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee9]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fbf9f4] transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                        order.action === 'SELL'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#bbeecf] text-[#002112]'
                      }`}
                    >
                      {order.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#1b1c19]">{order.ticker}</div>
                    <div className="text-[10px] text-[#75777d]">{order.name}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-medium text-[#44474c] bg-[#f0eee9] px-2 py-0.5 rounded">
                      {order.taxLotMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#1b1c19]">
                    {order.action === 'SELL' ? '-' : '+'}
                    {order.shares}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#535f73]">
                    ${order.limitPrice.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div
                      className={`font-serif font-bold tabular-nums ${
                        order.action === 'SELL' ? 'text-[#ba1a1a]' : 'text-[#2F5D45]'
                      }`}
                    >
                      {order.action === 'SELL' ? '-' : '+'}
                      {formatCurrencyFull(order.estimatedValue)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {order.realizedGainLoss > 0 ? (
                      <span className="font-semibold text-[#2F5D45] tabular-nums">
                        +{formatCurrency(order.realizedGainLoss)}
                      </span>
                    ) : (
                      <span className="text-[#75777d] tabular-nums">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[11px] text-[#535f73]">
                      {order.taxCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Order Cards */}
        <div className="md:hidden divide-y divide-[#f0eee9]">
          {orders.map((order) => (
            <div key={order.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      order.action === 'SELL'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#bbeecf] text-[#002112]'
                    }`}
                  >
                    {order.action} {order.shares} shs
                  </span>
                  <span className="font-bold text-xs text-[#1b1c19]">{order.ticker}</span>
                </div>
                <span
                  className={`font-serif font-bold text-sm tabular-nums ${
                    order.action === 'SELL' ? 'text-[#ba1a1a]' : 'text-[#2F5D45]'
                  }`}
                >
                  {order.action === 'SELL' ? '-' : '+'}
                  {formatCurrency(order.estimatedValue)}
                </span>
              </div>

              <div className="text-[11px] text-[#535f73] flex items-center justify-between">
                <span>{order.taxLotMethod}</span>
                <span>Limit @ ${order.limitPrice.toFixed(2)}</span>
              </div>

              {order.realizedGainLoss > 0 && (
                <div className="text-[10px] text-[#2F5D45]">
                  Realized Gain: +{formatCurrency(order.realizedGainLoss)} ({order.taxCategory})
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Rebalance Settlement Summary (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Gross Disinvestment</div>
          <div className="mt-1 font-serif text-2xl font-bold text-[#ba1a1a] tabular-nums">
            -${formatCurrencyFull(REBALANCE_SUMMARY.grossDisinvestment)}
          </div>
          <div className="mt-1 text-[11px] text-[#535f73]">
            AAPL & VUG Growth Trim
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Gross Reinvestment</div>
          <div className="mt-1 font-serif text-2xl font-bold text-[#2F5D45] tabular-nums">
            +${formatCurrencyFull(REBALANCE_SUMMARY.grossReinvestment)}
          </div>
          <div className="mt-1 text-[11px] text-[#535f73]">
            AGG & SGOV Treasury Deployment
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Net Cash Drag</div>
          <div className="mt-1 font-serif text-2xl font-bold text-[#101c2d] tabular-nums">
            $0.20
          </div>
          <div className="mt-1 text-[11px] font-semibold text-[#2F5D45]">
            100% Balanced Liquidity
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Projected Tax Friction</div>
          <div className="mt-1 font-serif text-2xl font-bold text-[#7a5902] tabular-nums">
            ${formatCurrencyFull(REBALANCE_SUMMARY.projectedTaxFriction)}
          </div>
          <div className="mt-1 text-[11px] text-[#535f73]">
            MinTax Lot Optimization Applied
          </div>
        </div>

      </div>

      {/* Advisory Execution Bar / Dual Signature Protocol */}
      <div className="p-5 rounded-2xl bg-[#101c2d] text-[#ffffff] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b2a41] border border-[#3c475a] flex items-center justify-center text-[#fcce73] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#ffffff] flex items-center gap-2">
              <span>Dual-Signature Custody Protocol</span>
              <span className="text-[10px] bg-[#2F5D45] px-1.5 py-0.5 rounded text-[#bbeecf] font-mono">
                Rule 206(4)-2
              </span>
            </div>
            <div className="text-[11px] text-[#bbc7de] mt-0.5">
              Advisor Signature Verified: Arthur Montgomery, CFA (10/04/2024 14:15 EST)
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-end md:self-center">
          {approvalStatus === 'pending' && (
            <>
              <button
                onClick={handleDecline}
                className="px-4 py-2.5 rounded-xl bg-[#1b2a41] hover:bg-[#253651] text-[#ffffff] text-xs font-semibold transition-colors"
              >
                Decline Proposal
              </button>
              <button
                onClick={() => setShowConfirmationModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#fcce73] hover:bg-[#edc066] text-[#261900] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#775600]" />
                <span>Approve Proposal & Stage Orders</span>
              </button>
            </>
          )}

          {approvalStatus === 'approved' && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#bbeecf]">
              <CheckCircle2 className="w-5 h-5 text-[#bbeecf]" />
              <span>Orders Staged into J.P. Morgan Order Desk</span>
            </div>
          )}

          {approvalStatus === 'declined' && (
            <button
              onClick={() => setApprovalStatus('pending')}
              className="px-4 py-2 rounded-xl bg-[#1b2a41] text-xs text-[#ffffff]"
            >
              Reopen Directive
            </button>
          )}
        </div>

      </div>

      {/* Section 5 Shared Contract Metadata */}
      <CalculationDisclosure
        asOf={CALCULATION_DISCLOSURES.rebalance.asOf}
        method={CALCULATION_DISCLOSURES.rebalance.method}
        assumptions={CALCULATION_DISCLOSURES.rebalance.assumptions}
        limitations={CALCULATION_DISCLOSURES.rebalance.limitations}
        computedAt={CALCULATION_DISCLOSURES.rebalance.computedAt}
      />

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#e4e2dd] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#bbeecf] text-[#002112] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#2F5D45]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1b1c19]">
                  Confirm Fiduciary Execution
                </h3>
                <p className="text-xs text-[#75777d]">
                  Directive RP-2024-09 • 4 Market Orders
                </p>
              </div>
            </div>

            <p className="text-xs text-[#44474c] leading-relaxed">
              By authorizing this rebalance, you execute the staged sell and buy orders across the Sterling Family Revocable Trust via J.P. Morgan Private Bank custody. Total liquidation of $41,550.20 will immediately fund fixed income deployment with neutral cash drag.
            </p>

            <div className="p-3 bg-[#f5f3ee] rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#535f73]">Total Orders:</span>
                <span className="font-bold text-[#1b1c19]">4 Orders (2 Sells, 2 Buys)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#535f73]">Tax Friction:</span>
                <span className="font-bold text-[#7a5902]">$1,224.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#535f73]">Custodial Desk:</span>
                <span className="font-bold text-[#1b1c19]">J.P. Morgan PB Discretionary</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#535f73] hover:text-[#1b1c19]"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-5 py-2.5 rounded-xl bg-[#101c2d] hover:bg-[#1b2a41] text-[#ffffff] text-xs font-bold shadow-xs"
              >
                Confirm & Stage to Order Desk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
