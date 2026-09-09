import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, Clock, Database, AlertTriangle } from 'lucide-react';

interface CalculationDisclosureProps {
  asOf: string;
  method: string;
  assumptions: Record<string, string | number>;
  limitations: string[];
  computedAt: string;
  compact?: boolean;
}

export const CalculationDisclosure: React.FC<CalculationDisclosureProps> = ({
  asOf,
  method,
  assumptions,
  limitations,
  computedAt,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(!compact);

  return (
    <div className="mt-4 rounded-xl border border-[#e4e2dd] bg-[#fbf9f4] overflow-hidden text-xs text-[#535f73]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 bg-[#f5f3ee] hover:bg-[#eae8e3] transition-colors flex items-center justify-between text-left font-medium text-[#1b1c19]"
      >
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#7a5902]" />
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#75777d]">
            Fiduciary Calculation Disclosure • Contract Model §5
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#75777d]">
          <span className="font-mono">{method}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 space-y-3 bg-[#ffffff] divide-y divide-[#f0eee9]">
          
          {/* Top Lineage Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#75777d]" />
              <span className="text-[#75777d]">As-of Date:</span>
              <span className="font-mono font-medium text-[#1b1c19]">{asOf}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-[#2F5D45]" />
              <span className="text-[#75777d]">Source:</span>
              <span className="font-medium text-[#1b1c19]">Custodial Ledger Feed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#7a5902]" />
              <span className="text-[#75777d]">Computed:</span>
              <span className="font-mono text-[#1b1c19]">{computedAt}</span>
            </div>
          </div>

          {/* Model Assumptions */}
          <div className="pt-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#75777d] mb-1.5">
              Stated Assumptions (Parameters)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {Object.entries(assumptions).map(([key, val]) => (
                <div key={key} className="p-2 rounded-lg bg-[#fbf9f4] border border-[#eae8e3]">
                  <div className="text-[10px] text-[#75777d] capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="font-mono font-semibold text-xs text-[#1b1c19] mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Limitations & Caveats */}
          <div className="pt-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#75777d] mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#7a5902]" />
              <span>Mandatory Disclaimers & Model Limitations</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#535f73] leading-relaxed">
              {limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};
