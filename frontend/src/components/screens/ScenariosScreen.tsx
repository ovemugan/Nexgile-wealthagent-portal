import React, { useState } from 'react';
import { ScreenId, ScenarioParams } from '../../types';
import { HOUSEHOLD_INFO, PORTFOLIO_METRICS, CALCULATION_DISCLOSURES } from '../../data/mockData';
import { CalculationDisclosure } from '../CalculationDisclosure';
import {
  TrendingUp,
  Sliders,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';

interface ScenariosScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const ScenariosScreen: React.FC<ScenariosScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const [params, setParams] = useState<ScenarioParams>({
    retirementAge: 65,
    monthlyInflow: 6500,
    annualDrawdown: 180000,
    expectedGrossReturn: 6.8,
    coreInflationIndex: 2.5,
    stressGFC: false,
    stressStagflation: false,
    stressTechCrash: false,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [showMobileSliders, setShowMobileSliders] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Compute dynamic Monte Carlo probability based on user adjustments
  let calculatedProbability = 91;
  if (params.monthlyInflow < 6500) calculatedProbability -= Math.round((6500 - params.monthlyInflow) / 800);
  if (params.monthlyInflow > 6500) calculatedProbability += Math.round((params.monthlyInflow - 6500) / 1000);
  if (params.annualDrawdown > 180000) calculatedProbability -= Math.round((params.annualDrawdown - 180000) / 15000);
  if (params.annualDrawdown < 180000) calculatedProbability += Math.round((180000 - params.annualDrawdown) / 20000);
  if (params.expectedGrossReturn < 6.8) calculatedProbability -= Math.round((6.8 - params.expectedGrossReturn) * 4);
  if (params.expectedGrossReturn > 6.8) calculatedProbability += Math.round((params.expectedGrossReturn - 6.8) * 3);
  if (params.coreInflationIndex > 2.5) calculatedProbability -= Math.round((params.coreInflationIndex - 2.5) * 3);

  // Shocks
  if (params.stressGFC) calculatedProbability -= 9;
  if (params.stressStagflation) calculatedProbability -= 6;
  if (params.stressTechCrash) calculatedProbability -= 5;

  calculatedProbability = Math.max(42, Math.min(99, calculatedProbability));

  // Projected outcomes based on probability
  const outcomeUpper = (5.48 * (calculatedProbability / 91)).toFixed(2);
  const outcomeMedian = (4.12 * (calculatedProbability / 91)).toFixed(2);
  const outcomeLower = (3.21 * (calculatedProbability / 91)).toFixed(2);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleReset = () => {
    setParams({
      retirementAge: 65,
      monthlyInflow: 6500,
      annualDrawdown: 180000,
      expectedGrossReturn: 6.8,
      coreInflationIndex: 2.5,
      stressGFC: false,
      stressStagflation: false,
      stressTechCrash: false,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Stochastic Wealth Path Projection • Plan #HH-4029
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            Family Retirement Freedom 2038
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            Longevity & Capital Preservation Horizon (10,000 Monte Carlo Trials)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0eee9] hover:bg-[#eae8e3] text-xs font-medium text-[#44474c] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Probability Gauge Banner */}
      <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e4e2dd] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eae8e3"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={calculatedProbability >= 85 ? '#2F5D45' : calculatedProbability >= 70 ? '#7a5902' : '#ba1a1a'}
                strokeWidth="3.5"
                strokeDasharray={`${calculatedProbability}, 100`}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute font-serif text-base font-bold text-[#1b1c19]">
              {calculatedProbability}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  calculatedProbability >= 85
                    ? 'bg-[#bbeecf] text-[#002112]'
                    : calculatedProbability >= 70
                    ? 'bg-[#ffdea4] text-[#5d4200]'
                    : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}
              >
                {calculatedProbability >= 85
                  ? 'High Confidence Mandate'
                  : calculatedProbability >= 70
                  ? 'Moderate Confidence'
                  : 'Fiduciary Remediation Needed'}
              </span>
              <span className="text-xs text-[#75777d]">Target: $3,500,000 by 2038</span>
            </div>
            <p className="text-xs text-[#535f73] mt-1 max-w-xl">
              Simulation indicates a {calculatedProbability}% probability that current trust assets and contributions will sustain family distributions through target longevity without capital depletion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-right">
            <div className="text-[11px] text-[#75777d]">Median Projected Net Worth</div>
            <div className="font-serif text-xl font-bold text-[#1b1c19] tabular-nums">
              ${outcomeMedian}M
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Stochastic Fan Chart (Left) & Scenario Modeler (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Stochastic Wealth Path (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eee9]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1b1c19]">
                  Stochastic Wealth Path Projection
                </h2>
                <p className="text-xs text-[#75777d] mt-0.5">
                  10,000 trials across varied macro regimes (2024 – 2045)
                </p>
              </div>
              <span className="text-[10px] font-mono bg-[#f0eee9] text-[#535f73] px-2 py-1 rounded">
                Monte Carlo v4.2
              </span>
            </div>

            {/* Fan Chart SVG */}
            <div className="mt-4 relative h-64 w-full bg-[#fbf9f4] rounded-xl p-3 border border-[#f0eee9] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                <defs>
                  {/* Fan corridor gradients */}
                  <linearGradient id="fanTopGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F5D45" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2F5D45" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="fanBottomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7a5902" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#eae8e3" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#eae8e3" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#eae8e3" strokeDasharray="3 3" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="#eae8e3" strokeDasharray="3 3" />

                {/* Target $3.5M line (Dotted red/gold) */}
                <line x1="0" y1="120" x2="500" y2="120" stroke="#ba1a1a" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
                <text x="490" y="115" textAnchor="end" fontSize="9" fill="#ba1a1a" fontFamily="sans-serif">
                  Target: $3.50M
                </text>

                {/* Retirement Date 2038 vertical marker */}
                <line x1="330" y1="10" x2="330" y2="200" stroke="#101c2d" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                <text x="330" y="25" textAnchor="middle" fontSize="9" fill="#101c2d" fontWeight="bold">
                  2038 Transition
                </text>

                {/* 90th percentile to 10th percentile Fan Corridor */}
                <path
                  d="M 20 160 Q 150 145, 330 90 T 480 30 L 480 185 Q 330 165, 150 162 Z"
                  fill="url(#fanTopGrad)"
                />

                {/* 90th percentile Upper Boundary Line */}
                <path
                  d="M 20 160 Q 150 145, 330 90 T 480 30"
                  fill="none"
                  stroke="#2F5D45"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />

                {/* 50th percentile Median Path (Solid Dark Ink) */}
                <path
                  d="M 20 160 Q 150 150, 330 115 T 480 75"
                  fill="none"
                  stroke="#101c2d"
                  strokeWidth="3"
                />

                {/* 10th percentile Conservative Floor Line */}
                <path
                  d="M 20 160 Q 150 158, 330 145 T 480 140"
                  fill="none"
                  stroke="#7a5902"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* Dots on 2045 */}
                <circle cx="480" cy="30" r="4" fill="#2F5D45" />
                <circle cx="480" cy="75" r="4.5" fill="#101c2d" />
                <circle cx="480" cy="140" r="4" fill="#7a5902" />
              </svg>

              {/* Callouts on right edge */}
              <div className="absolute right-3 top-3 bg-[#ffffff]/90 backdrop-blur-xs p-2 rounded-lg border border-[#e4e2dd] text-[10px] space-y-1">
                <div className="text-[#2F5D45] font-bold">90th: ${outcomeUpper}M</div>
                <div className="text-[#101c2d] font-bold">50th: ${outcomeMedian}M</div>
                <div className="text-[#7a5902] font-bold">10th: ${outcomeLower}M</div>
              </div>
            </div>

            {/* Outcome Cards Trio */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#f0eee9]">
                <div className="text-[11px] text-[#2F5D45] font-semibold">90th Percentile</div>
                <div className="mt-1 font-serif text-xl font-bold text-[#1b1c19] tabular-nums">
                  ${outcomeUpper}M
                </div>
                <div className="text-[10px] text-[#75777d] mt-0.5">
                  High-market compounder
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
                <div className="text-[11px] text-[#101c2d] font-bold">50th Percentile (Median)</div>
                <div className="mt-1 font-serif text-xl font-bold text-[#101c2d] tabular-nums">
                  ${outcomeMedian}M
                </div>
                <div className="text-[10px] text-[#535f73] mt-0.5">
                  Expected central path
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#f0eee9]">
                <div className="text-[11px] text-[#7a5902] font-semibold">10th Percentile</div>
                <div className="mt-1 font-serif text-xl font-bold text-[#1b1c19] tabular-nums">
                  ${outcomeLower}M
                </div>
                <div className="text-[10px] text-[#75777d] mt-0.5">
                  Conservative stress floor
                </div>
              </div>
            </div>
          </div>

          {/* Capital Transition Architecture */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#1b1c19]">
              Capital Transition Architecture
            </h3>
            <p className="text-xs text-[#75777d] mt-0.5">
              Three planned phases of the Sterling wealth governance model
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#f0eee9] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#101c2d] text-[#ffffff] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  I
                </span>
                <div className="text-xs">
                  <div className="font-bold text-[#1b1c19]">Phase I: Wealth Accumulation & Inflow (2024 – 2038)</div>
                  <div className="text-[#535f73] mt-0.5">
                    $6,500 monthly trust deposits deployed into balanced growth index and fixed income yield tranches.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#f0eee9] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#7a5902] text-[#ffffff] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  II
                </span>
                <div className="text-xs">
                  <div className="font-bold text-[#1b1c19]">Phase II: Retirement Drawdown & Lifestyle Distributions (2038 – 2045)</div>
                  <div className="text-[#535f73] mt-0.5">
                    $180,000 annual distribution funded via tax-efficient dividends and fixed income maturities.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#f0eee9] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#2F5D45] text-[#ffffff] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  III
                </span>
                <div className="text-xs">
                  <div className="font-bold text-[#1b1c19]">Phase III: Dynasty Trust & Next-Gen Bequests (2045+)</div>
                  <div className="text-[#535f73] mt-0.5">
                    Residual capital transitions to irrevocable generation-skipping trusts with stepped-up basis.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Interactive Scenario Modeler (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eee9]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1b1c19]">
                  Scenario Adjustments
                </h3>
                <p className="text-xs text-[#75777d] mt-0.5">
                  Interactive parameters modifying simulation trials
                </p>
              </div>
              <Sliders className="w-4 h-4 text-[#75777d]" />
            </div>

            <div className="mt-4 space-y-4">
              
              {/* Retirement Age Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-[#1b1c19] mb-1">
                  <span>Target Retirement Age</span>
                  <span className="font-bold font-mono">{params.retirementAge} years</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="72"
                  value={params.retirementAge}
                  onChange={(e) => setParams({ ...params, retirementAge: Number(e.target.value) })}
                  className="w-full accent-[#101c2d] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#75777d]">
                  <span>55</span>
                  <span>65</span>
                  <span>72</span>
                </div>
              </div>

              {/* Monthly Inflow Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-[#1b1c19] mb-1">
                  <span>Monthly Trust Inflows</span>
                  <span className="font-bold font-mono">${params.monthlyInflow.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="15000"
                  step="500"
                  value={params.monthlyInflow}
                  onChange={(e) => setParams({ ...params, monthlyInflow: Number(e.target.value) })}
                  className="w-full accent-[#101c2d] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#75777d]">
                  <span>$2,000</span>
                  <span>$6,500</span>
                  <span>$15,000</span>
                </div>
              </div>

              {/* Annual Drawdown Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-[#1b1c19] mb-1">
                  <span>Annual Retirement Drawdown</span>
                  <span className="font-bold font-mono">${params.annualDrawdown.toLocaleString()} / yr</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="300000"
                  step="10000"
                  value={params.annualDrawdown}
                  onChange={(e) => setParams({ ...params, annualDrawdown: Number(e.target.value) })}
                  className="w-full accent-[#101c2d] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#75777d]">
                  <span>$100k</span>
                  <span>$180k</span>
                  <span>$300k</span>
                </div>
              </div>

              {/* Expected Return Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-[#1b1c19] mb-1">
                  <span>Expected Gross Return</span>
                  <span className="font-bold font-mono">{params.expectedGrossReturn}%</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={params.expectedGrossReturn}
                  onChange={(e) => setParams({ ...params, expectedGrossReturn: Number(e.target.value) })}
                  className="w-full accent-[#101c2d] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#75777d]">
                  <span>4.0% Conservative</span>
                  <span>6.8% Core</span>
                  <span>10.0% Bull</span>
                </div>
              </div>

              {/* Inflation Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-[#1b1c19] mb-1">
                  <span>Core Inflation Index</span>
                  <span className="font-bold font-mono">{params.coreInflationIndex}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={params.coreInflationIndex}
                  onChange={(e) => setParams({ ...params, coreInflationIndex: Number(e.target.value) })}
                  className="w-full accent-[#101c2d] cursor-pointer"
                />
              </div>

            </div>

            {/* Historical Macro Stress Shocks */}
            <div className="mt-5 pt-4 border-t border-[#f0eee9]">
              <div className="text-xs font-bold text-[#1b1c19] flex items-center justify-between mb-2">
                <span>Historical Macro Stress Tests</span>
                <span className="text-[10px] text-[#ba1a1a] font-mono">Fat-Tail Shocks</span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4] border border-[#eae8e3] text-xs cursor-pointer hover:bg-[#f5f3ee] transition-colors">
                  <span className="text-[#1b1c19]">2008 Global Financial Crisis (-28% equity)</span>
                  <input
                    type="checkbox"
                    checked={params.stressGFC}
                    onChange={(e) => setParams({ ...params, stressGFC: e.target.checked })}
                    className="accent-[#101c2d]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4] border border-[#eae8e3] text-xs cursor-pointer hover:bg-[#f5f3ee] transition-colors">
                  <span className="text-[#1b1c19]">1970s Stagflation Shock (+5% inflation, bond drag)</span>
                  <input
                    type="checkbox"
                    checked={params.stressStagflation}
                    onChange={(e) => setParams({ ...params, stressStagflation: e.target.checked })}
                    className="accent-[#101c2d]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4] border border-[#eae8e3] text-xs cursor-pointer hover:bg-[#f5f3ee] transition-colors">
                  <span className="text-[#1b1c19]">2000 Tech Crash / High Beta Drawdown</span>
                  <input
                    type="checkbox"
                    checked={params.stressTechCrash}
                    onChange={(e) => setParams({ ...params, stressTechCrash: e.target.checked })}
                    className="accent-[#101c2d]"
                  />
                </label>
              </div>
            </div>

            {/* Simulation Action Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="mt-5 w-full py-3 rounded-xl bg-[#101c2d] hover:bg-[#1b2a41] text-[#ffffff] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-[#fcce73] ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating 10,000 Trial Paths...' : 'Recalculate & Sync to Wealth Plan'}</span>
            </button>

          </div>

          {/* Section 5 Calculation Contract Metadata */}
          <CalculationDisclosure
            asOf={CALCULATION_DISCLOSURES.monteCarlo.asOf}
            method={CALCULATION_DISCLOSURES.monteCarlo.method}
            assumptions={CALCULATION_DISCLOSURES.monteCarlo.assumptions}
            limitations={CALCULATION_DISCLOSURES.monteCarlo.limitations}
            computedAt={CALCULATION_DISCLOSURES.monteCarlo.computedAt}
          />

        </div>

      </div>

    </div>
  );
};
