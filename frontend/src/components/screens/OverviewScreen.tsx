import React, { useState } from 'react';
import { ScreenId } from '../../types';
import {
  HOUSEHOLD_INFO,
  PORTFOLIO_METRICS,
  ASSET_ALLOCATION,
  HOLDINGS_LIST,
  FIDUCIARY_GOALS,
  PERFORMANCE_HISTORY
} from '../../data/mockData';
import { useAppData } from '../../data/AppDataContext';
import {
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  AlertTriangle,
  FileCheck2,
  PieChart,
  DollarSign,
  Wallet,
  Sparkles
} from 'lucide-react';

interface OverviewScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const { householdInfo: HOUSEHOLD_INFO, metrics: PORTFOLIO_METRICS, holdings: HOLDINGS_LIST } = useAppData();
  const [activeHorizon, setActiveHorizon] = useState<'1M' | '3M' | '1Y' | '5Y'>('1Y');

  // Format currency helpers
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

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Sovereign Ledger • Active Mandate
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            {HOUSEHOLD_INFO.householdName}
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            {HOUSEHOLD_INFO.primaryTrust} • {HOUSEHOLD_INFO.custodian} ({HOUSEHOLD_INFO.accountNumber})
          </p>
        </div>

        {/* Fiduciary status pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0eee9] border border-[#e4e2dd] text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#7a5902]" />
            <span className="text-[#44474c]">Fiduciary Review:</span>
            <span className="font-semibold text-[#1b1c19]">{HOUSEHOLD_INFO.nextReviewDate}</span>
          </div>
          <button
            onClick={() => onNavigate('rebalance')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c2d] text-[#ffffff] text-xs font-medium hover:bg-[#1b2a41] transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fcce73]" />
            <span>Review Drift</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Cards (Desktop: 4 columns, Mobile: Consolidated Card + 2 stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Aggregate Fiduciary Net Worth */}
        <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#101c2d]" />
          <div className="flex items-center justify-between text-xs text-[#75777d] font-medium">
            <span>Consolidated Portfolio Value</span>
            <span className="p-1 rounded-md bg-[#f5f3ee] text-[#101c2d]">
              <Wallet className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-serif text-3xl lg:text-3xl font-bold tracking-tight text-[#1b1c19] tabular-nums">
            {isMobileView ? formatCurrency(PORTFOLIO_METRICS.aggregateNetWorth) : formatCurrencyFull(PORTFOLIO_METRICS.aggregateNetWorth)}
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#bbeecf] text-[#002112]">
              <ArrowUpRight className="w-3 h-3" />
              +{PORTFOLIO_METRICS.ytdGainPercent}% YTD
            </span>
            <span className="text-xs text-[#75777d] tabular-nums">
              +{formatCurrency(PORTFOLIO_METRICS.ytdGainDollar)}
            </span>
          </div>
        </div>

        {/* Card 2: Liquid Reserves */}
        <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#75777d] font-medium">
            <span>Liquid Reserves & Sweeps</span>
            <span className="p-1 rounded-md bg-[#f5f3ee] text-[#7a5902]">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#1b1c19] tabular-nums">
            {formatCurrency(PORTFOLIO_METRICS.liquidReserves)}
          </div>
          <div className="mt-2.5 text-xs text-[#535f73] flex items-center justify-between">
            <span>Yield Spread: 5.25% T-Bills</span>
            <span className="text-[#2F5D45] font-semibold">Ready</span>
          </div>
        </div>

        {/* Card 3: Unrealized Capital Gains */}
        <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#75777d] font-medium">
            <span>Unrealized Capital Gain</span>
            <span className="p-1 rounded-md bg-[#f5f3ee] text-[#2F5D45]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#2F5D45] tabular-nums">
            +{formatCurrency(PORTFOLIO_METRICS.unrealizedGainDollar)}
          </div>
          <div className="mt-2.5 text-xs text-[#535f73] flex items-center justify-between">
            <span>Appreciation: +{PORTFOLIO_METRICS.unrealizedGainPercent}%</span>
            <span className="text-[#75777d]">Cost $2.19M</span>
          </div>
        </div>

        {/* Card 4: Est. Annual Dividend Income */}
        <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#75777d] font-medium">
            <span>Est. Annual Cash Yield</span>
            <span className="p-1 rounded-md bg-[#f5f3ee] text-[#535f73]">
              <PieChart className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#1b1c19] tabular-nums">
            {formatCurrency(PORTFOLIO_METRICS.annualDividendIncome)}
          </div>
          <div className="mt-2.5 text-xs text-[#535f73] flex items-center justify-between">
            <span>Composite Yield: {PORTFOLIO_METRICS.dividendYield}%</span>
            <span className="text-[#7a5902] font-semibold">$7,850 / mo</span>
          </div>
        </div>

      </div>

      {/* Middle Section: Asset Allocation Matrix & Performance Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Asset Allocation Matrix (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0eee9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1b1c19]">
                Asset Allocation Matrix
              </h2>
              <p className="text-xs text-[#75777d] mt-0.5">
                Strategic Mandate vs. Current Market Weight
              </p>
            </div>
            <button
              onClick={() => onNavigate('rebalance')}
              className="text-xs font-semibold text-[#7a5902] hover:text-[#5d4200] flex items-center gap-1 transition-colors"
            >
              <span>Inspect Drift (+4.2%)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Segmented Proportional Progress Bar */}
          <div className="mt-5">
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-[#e4e2dd] p-0.5 shadow-inner">
              {ASSET_ALLOCATION.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90 relative group"
                  title={`${cat.name}: ${cat.percentage}% (Target: ${cat.targetPercentage}%)`}
                />
              ))}
            </div>
          </div>

          {/* Category Cards List */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ASSET_ALLOCATION.map((cat) => (
              <div
                key={cat.name}
                className="p-3 rounded-xl bg-[#fbf9f4] border border-[#f0eee9] hover:border-[#c5c6cd] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-semibold text-[#1b1c19]">
                      {cat.name}
                    </span>
                  </div>
                  {cat.drift !== 0 ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        cat.drift > 0
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#f0eee9] text-[#75777d]'
                      }`}
                    >
                      {cat.drift > 0 ? `+${cat.drift}% drift` : `${cat.drift}% drift`}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#2F5D45] bg-[#bbeecf]/50 px-1.5 py-0.5 rounded">
                      On Target
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#1b1c19] tabular-nums font-serif">
                    {formatCurrency(cat.value)}
                  </span>
                  <div className="text-xs text-[#535f73] tabular-nums">
                    <span className="font-semibold text-[#1b1c19]">{cat.percentage}%</span>
                    <span className="text-[#8c9099] ml-1">/ {cat.targetPercentage}% target</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Net Performance Trajectory (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eee9]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1b1c19]">
                  Net Performance
                </h2>
                <p className="text-xs text-[#75777d] mt-0.5">
                  Consolidated Capital Growth Trajectory
                </p>
              </div>

              {/* Horizon Switcher */}
              <div className="flex items-center bg-[#f0eee9] p-0.5 rounded-lg text-[11px] font-semibold">
                {(['1M', '3M', '1Y', '5Y'] as const).map((hz) => (
                  <button
                    key={hz}
                    onClick={() => setActiveHorizon(hz)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      activeHorizon === hz
                        ? 'bg-[#ffffff] text-[#1b1c19] shadow-xs'
                        : 'text-[#75777d] hover:text-[#1b1c19]'
                    }`}
                  >
                    {hz}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance SVG Trajectory Line */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-serif text-xl font-bold text-[#1b1c19] tabular-nums">
                  +$346,410.00
                </span>
                <span className="text-xs font-semibold text-[#2F5D45] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +8.79% Benchmark Outperformance
                </span>
              </div>

              <div className="relative h-44 w-full bg-[#fbf9f4] rounded-xl p-2 border border-[#f0eee9] overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#101c2d" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#101c2d" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7a5902" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#7a5902" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#eae8e3" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="#eae8e3" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#eae8e3" strokeDasharray="3 3" />

                  {/* Benchmark 60/40 line (dashed amber) */}
                  <path
                    d="M 10 125 Q 70 115, 130 100 T 250 78 T 390 55"
                    fill="none"
                    stroke="#a9822f"
                    strokeWidth="1.75"
                    strokeDasharray="4 3"
                  />

                  {/* Sterling Portfolio Curve (Solid Dark Ink with area fill) */}
                  <path
                    d="M 10 130 Q 70 110, 130 85 T 250 60 T 390 25 L 390 145 L 10 145 Z"
                    fill="url(#wealthGrad)"
                  />
                  <path
                    d="M 10 130 Q 70 110, 130 85 T 250 60 T 390 25"
                    fill="none"
                    stroke="#101c2d"
                    strokeWidth="2.75"
                  />

                  {/* Latest endpoint pulsing dot */}
                  <circle cx="390" cy="25" r="4.5" fill="#101c2d" />
                  <circle cx="390" cy="25" r="8" fill="#101c2d" fillOpacity="0.2" className="animate-ping" />
                </svg>

                {/* Legend at bottom of chart */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-[#75777d]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-[#101c2d] rounded-full" />
                      Sterling Discretionary
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-[#a9822f] rounded-full" />
                      Blended Fiduciary Index
                    </span>
                  </div>
                  <span className="font-mono">Q3 Trajectory</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick period summary */}
          <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs">
            <span className="text-[#535f73]">Trailing 12-Mo Alpha</span>
            <span className="font-bold text-[#2F5D45] tabular-nums">+1.42% net of fees</span>
          </div>
        </div>

      </div>

      {/* Bottom Section: Fiduciary Goals & Principal Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Fiduciary Goals Status (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0eee9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1b1c19]">
                Fiduciary Goals Progress
              </h2>
              <p className="text-xs text-[#75777d] mt-0.5">
                Target milestones & Monte Carlo readiness
              </p>
            </div>
            <button
              onClick={() => onNavigate('scenarios')}
              className="text-xs font-semibold text-[#101c2d] hover:underline flex items-center gap-1"
            >
              <span>Simulate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {FIDUCIARY_GOALS.map((goal) => (
              <div key={goal.id} className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#f0eee9]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1b1c19]">{goal.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      goal.probability >= 85
                        ? 'bg-[#bbeecf] text-[#002112]'
                        : 'bg-[#ffdea4] text-[#5d4200]'
                    }`}
                  >
                    {goal.probability}% Prob.
                  </span>
                </div>

                <div className="mt-2.5">
                  <div className="flex justify-between text-[11px] text-[#535f73] mb-1">
                    <span>{formatCurrency(goal.currentAccumulated)} accumulated</span>
                    <span>Target: {formatCurrency(goal.targetAmount)} ({goal.targetYear})</span>
                  </div>
                  <div className="h-2 w-full bg-[#eae8e3] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.probability >= 85 ? 'bg-[#2F5D45]' : 'bg-[#7a5902]'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (goal.currentAccumulated / goal.targetAmount) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-[#75777d]">
                  <span>{goal.horizon}</span>
                  <span className="font-medium text-[#1b1c19]">{goal.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Advisor Card */}
          <div className="mt-5 p-4 rounded-xl bg-[#101c2d] text-[#ffffff] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffffff] text-[#101c2d] flex items-center justify-center font-serif font-bold text-sm">
                  AM
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#ffffff]">
                    {HOUSEHOLD_INFO.advisorName}
                  </div>
                  <div className="text-[11px] text-[#bbc7de]">
                    {HOUSEHOLD_INFO.advisorRole}
                  </div>
                </div>
              </div>
              <a
                href={`tel:${HOUSEHOLD_INFO.advisorPhone}`}
                className="px-3 py-1.5 rounded-lg bg-[#fcce73] text-[#775600] text-xs font-bold hover:bg-[#edc066] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Line</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Principal Holdings & Positions (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0eee9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1b1c19]">
                Principal Holdings
              </h2>
              <p className="text-xs text-[#75777d] mt-0.5">
                Top sovereign and taxable discretionary assets
              </p>
            </div>
            <button
              onClick={() => onNavigate('holdings')}
              className="text-xs font-semibold text-[#101c2d] hover:underline flex items-center gap-1"
            >
              <span>View All 28 Holdings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Holdings List Items */}
          <div className="mt-4 divide-y divide-[#f0eee9]">
            {HOLDINGS_LIST.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('holdings')}
                className="py-3 flex items-center justify-between hover:bg-[#fbf9f4] px-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f0eee9] group-hover:bg-[#eae8e3] flex items-center justify-center font-mono font-bold text-xs text-[#101c2d] transition-colors">
                    {item.ticker}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1b1c19] group-hover:text-[#7a5902] transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#75777d] flex items-center gap-2">
                      <span>{item.assetClass}</span>
                      <span>•</span>
                      <span>{item.units.toLocaleString()} units</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#1b1c19] font-serif tabular-nums">
                    {formatCurrency(item.marketValue)}
                  </div>
                  <div
                    className={`text-[11px] font-medium tabular-nums ${
                      item.unrealizedGain >= 0 ? 'text-[#2F5D45]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {item.unrealizedGain >= 0 ? '+' : ''}
                    {formatCurrency(item.unrealizedGain)} ({item.unrealizedGainPercent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom quick action bar */}
          <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between">
            <span className="text-xs text-[#75777d]">
              Audited by J.P. Morgan Private Bank Custody
            </span>
            <button
              onClick={() => onNavigate('holdings')}
              className="text-xs font-semibold text-[#7a5902] hover:text-[#5d4200] flex items-center gap-1"
            >
              <span>Open Position Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
