import React, { useState } from 'react';
import { ScreenId, HoldingItem } from '../../types';
import {
  HOUSEHOLD_INFO,
  PORTFOLIO_METRICS,
  HOLDINGS_LIST,
  ASSET_ALLOCATION
} from '../../data/mockData';
import { useAppData } from '../../data/AppDataContext';
import {
  Search,
  ArrowUpDown,
  FileDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface HoldingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const HoldingsScreen: React.FC<HoldingsScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const { householdInfo: HOUSEHOLD_INFO, metrics: PORTFOLIO_METRICS, holdings: HOLDINGS_LIST } = useAppData();
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'taxlots' | 'mandate'>('holdings');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<'value' | 'gain' | 'weight'>('value');
  const [selectedHolding, setSelectedHolding] = useState<HoldingItem | null>(null);

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

  // Filter & sort
  const filteredHoldings = HOLDINGS_LIST.filter((h) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Equities' && (h.assetClass === 'US Equities' || h.assetClass === 'Global Equities')) ||
      h.assetClass === selectedCategory;

    const matchesSearch =
      h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.assetClass.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortKey === 'value') return b.marketValue - a.marketValue;
    if (sortKey === 'gain') return b.unrealizedGain - a.unrealizedGain;
    if (sortKey === 'weight') return b.portfolioWeight - a.portfolioWeight;
    return 0;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Custodian Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#2F5D45]" />
          <span className="font-semibold text-[#1b1c19]">{HOUSEHOLD_INFO.custodian}</span>
          <span className="text-[#75777d]">({HOUSEHOLD_INFO.accountNumber})</span>
          <span className="hidden md:inline text-[#c5c6cd]">|</span>
          <span className="text-[#535f73] hidden md:inline">{HOUSEHOLD_INFO.syncedTimestamp}</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => alert("Custodial ledger cache refreshed from J.P. Morgan Private Bank core feeds.")}
            className="flex items-center gap-1 text-[11px] font-medium text-[#535f73] hover:text-[#1b1c19] px-2 py-1 rounded bg-[#ffffff] border border-[#e4e2dd]"
          >
            <RefreshCw className="w-3 h-3 text-[#2F5D45]" />
            <span>Sync Feeds</span>
          </button>
          <button
            onClick={() => onNavigate('vault')}
            className="flex items-center gap-1 text-[11px] font-medium text-[#101c2d] hover:underline px-2 py-1"
          >
            <FileDown className="w-3 h-3 text-[#7a5902]" />
            <span>Ledger Statement</span>
          </button>
        </div>
      </div>

      {/* Trust Account Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Custodial Portfolio Ledger
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            {HOUSEHOLD_INFO.primaryTrust}
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            {HOUSEHOLD_INFO.portfolioType} • Custody Safekeeping at J.P. Morgan PB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('rebalance')}
            className="px-4 py-2 rounded-xl bg-[#101c2d] text-[#ffffff] text-xs font-semibold hover:bg-[#1b2a41] transition-all flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#fcce73]" />
            <span>Rebalance Mandate</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Total Account Value</div>
          <div className="mt-1 font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tabular-nums">
            {formatCurrencyFull(PORTFOLIO_METRICS.trustAccountMarketValue)}
          </div>
          <div className="mt-1 text-[11px] text-[#535f73]">
            Settled Cash & Discretionary Equities/Bonds
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Invested Cost Basis</div>
          <div className="mt-1 font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tabular-nums">
            {formatCurrencyFull(PORTFOLIO_METRICS.totalInvestedCostBasis)}
          </div>
          <div className="mt-1 text-[11px] text-[#535f73]">
            Tax Lot Baseline (MinTax & HIFO optimization)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs">
          <div className="text-xs text-[#75777d] font-medium">Unrealized Capital Gain</div>
          <div className="mt-1 font-serif text-2xl lg:text-3xl font-bold text-[#2F5D45] tabular-nums">
            +{formatCurrencyFull(PORTFOLIO_METRICS.unrealizedGainDollar)}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#2F5D45]">
            +{PORTFOLIO_METRICS.unrealizedGainPercent}% aggregate appreciation
          </div>
        </div>

      </div>

      {/* Allocation Drift Alert Banner */}
      <div className="p-4 rounded-xl bg-[#ffdea4]/30 border border-[#fcce73] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#fcce73] text-[#7a5902] shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#261900]">
              Target Allocation Drift Detected: US Equities +4.2% Variance Breach
            </div>
            <div className="text-xs text-[#5d4200] mt-0.5">
              Equity market appreciation has pushed US Equities to 46.2% vs. 42.0% strategic target. Rebalancing proposal RP-2024-09 has been staged.
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('rebalance')}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-[#101c2d] text-[#ffffff] text-xs font-semibold hover:bg-[#1b2a41] transition-all shrink-0"
        >
          Review Mandate Proposal
        </button>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="border-b border-[#e4e2dd] flex items-center gap-6 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`pb-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'holdings'
              ? 'border-[#101c2d] text-[#101c2d]'
              : 'border-transparent text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          Holdings ({HOLDINGS_LIST.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'border-[#101c2d] text-[#101c2d]'
              : 'border-transparent text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          Transactions & Cash Flow
        </button>
        <button
          onClick={() => setActiveTab('taxlots')}
          className={`pb-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'taxlots'
              ? 'border-[#101c2d] text-[#101c2d]'
              : 'border-transparent text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          Tax Lots & Realized Gains
        </button>
        <button
          onClick={() => setActiveTab('mandate')}
          className={`pb-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'mandate'
              ? 'border-[#101c2d] text-[#101c2d]'
              : 'border-transparent text-[#75777d] hover:text-[#1b1c19]'
          }`}
        >
          Fiduciary Mandate Model
        </button>
      </div>

      {activeTab === 'holdings' && (
        <div className="space-y-4">
          
          {/* Controls toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-xl border border-[#e4e2dd]">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search holdings by ticker, name, or asset class..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#fbf9f4] border border-[#eae8e3] text-xs focus:outline-none focus:border-[#101c2d]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Equities', 'Fixed Income', 'Alternatives'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#101c2d] text-[#ffffff]'
                      : 'bg-[#f0eee9] text-[#44474c] hover:bg-[#eae8e3]'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Sort selector */}
              <div className="flex items-center gap-1 pl-2 border-l border-[#eae8e3]">
                <span className="text-[11px] text-[#75777d]">Sort:</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#1b1c19] focus:outline-none"
                >
                  <option value="value">Market Value</option>
                  <option value="gain">Unrealized Gain</option>
                  <option value="weight">Portfolio Weight</option>
                </select>
              </div>
            </div>

          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#ffffff] rounded-2xl border border-[#e4e2dd] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f5f3ee] text-[#535f73] font-semibold border-b border-[#e4e2dd]">
                  <tr>
                    <th className="py-3 px-4">Asset & Ticker</th>
                    <th className="py-3 px-3">Asset Class</th>
                    <th className="py-3 px-3 text-right">Units</th>
                    <th className="py-3 px-3 text-right">Price / 24h</th>
                    <th className="py-3 px-3 text-right">Cost Basis</th>
                    <th className="py-3 px-4 text-right">Market Value</th>
                    <th className="py-3 px-4 text-right">Target Weight</th>
                    <th className="py-3 px-4 text-right">Unrealized Gain</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eee9]">
                  {filteredHoldings.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedHolding(item)}
                      className="hover:bg-[#fbf9f4] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-[#f0eee9] text-[#101c2d]">
                            {item.ticker}
                          </span>
                          <div>
                            <div className="font-semibold text-[#1b1c19] group-hover:text-[#7a5902] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#75777d]">
                              {item.taxLotMethod}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f0eee9] text-[#44474c]">
                          {item.assetClass}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#1b1c19]">
                        {item.units.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right tabular-nums">
                        <div className="font-medium text-[#1b1c19]">
                          ${item.currentPrice.toFixed(2)}
                        </div>
                        <div
                          className={`text-[10px] font-semibold flex items-center justify-end ${
                            item.change24h >= 0 ? 'text-[#2F5D45]' : 'text-[#ba1a1a]'
                          }`}
                        >
                          {item.change24h >= 0 ? '+' : ''}
                          {item.change24h}%
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#535f73]">
                        {formatCurrency(item.costBasis)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="font-serif font-bold text-[#1b1c19] tabular-nums">
                          {formatCurrency(item.marketValue)}
                        </div>
                        <div className="text-[10px] text-[#75777d]">
                          {item.portfolioWeight}% of Trust
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs font-semibold tabular-nums text-[#1b1c19]">
                            {item.targetWeight}%
                          </span>
                          {item.portfolioWeight > item.targetWeight ? (
                            <span className="text-[9px] text-[#ba1a1a] bg-[#ffdad6] px-1 rounded font-bold">
                              Over
                            </span>
                          ) : (
                            <span className="text-[9px] text-[#2F5D45] bg-[#bbeecf] px-1 rounded font-bold">
                              Align
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-16 bg-[#eae8e3] rounded-full overflow-hidden ml-auto mt-1">
                          <div
                            className="h-full bg-[#101c2d] rounded-full"
                            style={{
                              width: `${Math.min(100, (item.portfolioWeight / 30) * 100)}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div
                          className={`font-semibold tabular-nums ${
                            item.unrealizedGain >= 0 ? 'text-[#2F5D45]' : 'text-[#ba1a1a]'
                          }`}
                        >
                          {item.unrealizedGain >= 0 ? '+' : ''}
                          {formatCurrency(item.unrealizedGain)}
                        </div>
                        <div
                          className={`text-[10px] ${
                            item.unrealizedGain >= 0 ? 'text-[#2F5D45]' : 'text-[#ba1a1a]'
                          }`}
                        >
                          {item.unrealizedGain >= 0 ? '+' : ''}
                          {item.unrealizedGainPercent}%
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('rebalance');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#f0eee9] hover:bg-[#101c2d] hover:text-[#ffffff] text-[11px] font-semibold text-[#1b1c19] transition-all"
                        >
                          Order Desk
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Position Cards */}
          <div className="md:hidden space-y-3">
            {filteredHoldings.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHolding(item)}
                className="p-4 rounded-xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs active:bg-[#fbf9f4] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-[#f0eee9] text-[#101c2d]">
                      {item.ticker}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#1b1c19]">{item.name}</div>
                      <div className="text-[10px] text-[#75777d]">{item.units.toLocaleString()} shs @ ${item.currentPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif font-bold text-sm text-[#1b1c19] tabular-nums">
                      {formatCurrency(item.marketValue)}
                    </div>
                    <div className="text-[10px] text-[#75777d]">{item.portfolioWeight}% alloc</div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#f0eee9] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#75777d]">Unrealized: </span>
                    <span
                      className={`font-semibold tabular-nums ${
                        item.unrealizedGain >= 0 ? 'text-[#2F5D45]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {item.unrealizedGain >= 0 ? '+' : ''}
                      {formatCurrency(item.unrealizedGain)} ({item.unrealizedGainPercent}%)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('rebalance');
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#101c2d] text-[#ffffff] text-[10px] font-bold"
                  >
                    Order Desk
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Split: Allocation vs Mandate & Attestation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* Allocation vs Mandate */}
            <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#1b1c19]">
                Portfolio Allocation vs. Strategic Mandate
              </h3>
              <p className="text-xs text-[#75777d] mt-0.5">
                Target thresholds defined under Investment Policy Statement Q3-2024
              </p>

              <div className="mt-4 space-y-3">
                {ASSET_ALLOCATION.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#1b1c19]">{cat.name}</span>
                      <span className="text-[#535f73] tabular-nums">
                        Actual: <strong>{cat.percentage}%</strong> / Target: {cat.targetPercentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#f0eee9] rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiduciary Attestation */}
            <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2F5D45]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fiduciary Attestation Certificate</span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#1b1c19] mt-2">
                  SEC Rule 206(4)-2 Compliance
                </h4>
                <p className="text-xs text-[#535f73] mt-1 leading-relaxed">
                  Discretionary trades and tax lots are executed pursuant to the fiduciary mandate established for {HOUSEHOLD_INFO.primaryTrust}. All assets held in segregated custody at {HOUSEHOLD_INFO.custodian}.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1b1c19]">
                    {HOUSEHOLD_INFO.fiduciaryAttestationBy}
                  </div>
                  <div className="text-[10px] text-[#75777d]">
                    Chief Fiduciary Officer • Signed {HOUSEHOLD_INFO.fiduciaryDate}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('vault')}
                  className="text-xs font-semibold text-[#7a5902] hover:underline"
                >
                  Verify Attestation
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="p-8 text-center bg-[#ffffff] rounded-2xl border border-[#e4e2dd]">
          <CheckCircle2 className="w-10 h-10 text-[#2F5D45] mx-auto mb-2" />
          <h3 className="font-serif text-lg font-bold text-[#1b1c19]">All 34 Ledger Transactions Reconciled</h3>
          <p className="text-xs text-[#75777d] max-w-md mx-auto mt-1">
            Last cash dividend settled: $4,280.00 from Vanguard Total World (VT) on Sep 28, 2024.
          </p>
          <button
            onClick={() => onNavigate('vault')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#101c2d] text-[#ffffff] text-xs font-semibold"
          >
            Download Reconciled Trade Blotter
          </button>
        </div>
      )}

      {activeTab === 'taxlots' && (
        <div className="p-8 text-center bg-[#ffffff] rounded-2xl border border-[#e4e2dd]">
          <TrendingUp className="w-10 h-10 text-[#7a5902] mx-auto mb-2" />
          <h3 className="font-serif text-lg font-bold text-[#1b1c19]">Automated MinTax Lot Optimizer</h3>
          <p className="text-xs text-[#75777d] max-w-md mx-auto mt-1">
            Specific Identification and HIFO algorithms minimize capital gains tax burden across discretionary tranches.
          </p>
        </div>
      )}

      {activeTab === 'mandate' && (
        <div className="p-8 text-center bg-[#ffffff] rounded-2xl border border-[#e4e2dd]">
          <ShieldCheck className="w-10 h-10 text-[#101c2d] mx-auto mb-2" />
          <h3 className="font-serif text-lg font-bold text-[#1b1c19]">Fiduciary Investment Policy Statement</h3>
          <p className="text-xs text-[#75777d] max-w-md mx-auto mt-1">
            Mandate target: 42% US Equities, 30% Fixed Income, 15% Global Equities, 10% Alternatives, 3% Cash.
          </p>
        </div>
      )}

    </div>
  );
};
