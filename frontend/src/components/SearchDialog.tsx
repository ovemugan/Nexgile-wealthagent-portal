import React, { useState } from 'react';
import { ScreenId } from '../types';
import { HOLDINGS_LIST, VAULT_DOCUMENTS, FIDUCIARY_GOALS } from '../data/mockData';
import { Search, X, ChevronRight, FileText, WalletCards, TrendingUp } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedHoldings = query.trim()
    ? HOLDINGS_LIST.filter(
        (h) =>
          h.ticker.toLowerCase().includes(query.toLowerCase()) ||
          h.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedDocs = query.trim()
    ? VAULT_DOCUMENTS.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full shadow-2xl border border-[#e4e2dd] overflow-hidden">
        
        {/* Search Input */}
        <div className="p-4 border-b border-[#e4e2dd] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#75777d]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, documents, scenarios, rebalance..."
            autoFocus
            className="flex-1 text-sm bg-transparent focus:outline-none text-[#1b1c19]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#75777d] hover:text-[#1b1c19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-4 text-xs">
          {query.trim() === '' ? (
            <div className="space-y-2 text-[#75777d]">
              <div className="font-semibold text-[#1b1c19]">Quick Navigation</div>
              <div
                onClick={() => {
                  onNavigate('overview');
                  onClose();
                }}
                className="p-2 rounded-lg hover:bg-[#f5f3ee] flex items-center justify-between cursor-pointer"
              >
                <span>Consolidated Portfolio Overview</span>
                <ChevronRight className="w-4 h-4 text-[#c5c6cd]" />
              </div>
              <div
                onClick={() => {
                  onNavigate('holdings');
                  onClose();
                }}
                className="p-2 rounded-lg hover:bg-[#f5f3ee] flex items-center justify-between cursor-pointer"
              >
                <span>Custodial Holdings (28 Assets)</span>
                <ChevronRight className="w-4 h-4 text-[#c5c6cd]" />
              </div>
              <div
                onClick={() => {
                  onNavigate('rebalance');
                  onClose();
                }}
                className="p-2 rounded-lg hover:bg-[#f5f3ee] flex items-center justify-between cursor-pointer"
              >
                <span>Fiduciary Rebalance Directive RP-2024-09</span>
                <ChevronRight className="w-4 h-4 text-[#c5c6cd]" />
              </div>
              <div
                onClick={() => {
                  onNavigate('scenarios');
                  onClose();
                }}
                className="p-2 rounded-lg hover:bg-[#f5f3ee] flex items-center justify-between cursor-pointer"
              >
                <span>Monte Carlo Stochastic Simulator</span>
                <ChevronRight className="w-4 h-4 text-[#c5c6cd]" />
              </div>
            </div>
          ) : (
            <>
              {matchedHoldings.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#75777d] mb-1">
                    Holdings & Positions
                  </div>
                  <div className="space-y-1">
                    {matchedHoldings.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          onNavigate('holdings');
                          onClose();
                        }}
                        className="p-2 rounded-lg hover:bg-[#fbf9f4] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{h.ticker}</span>
                          <span>{h.name}</span>
                        </div>
                        <span className="font-serif font-bold text-[#1b1c19]">
                          ${h.marketValue.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedDocs.length > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#75777d] mb-1">
                    Vault Documents
                  </div>
                  <div className="space-y-1">
                    {matchedDocs.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onNavigate('vault');
                          onClose();
                        }}
                        className="p-2 rounded-lg hover:bg-[#fbf9f4] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#7a5902]" />
                          <span>{d.title}</span>
                        </div>
                        <span className="text-[#75777d]">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedHoldings.length === 0 && matchedDocs.length === 0 && (
                <div className="text-center py-6 text-[#75777d]">
                  No matching assets or documents found for "{query}".
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
