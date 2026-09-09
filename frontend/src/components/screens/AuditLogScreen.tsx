import React, { useState } from 'react';
import { ScreenId, AuditEvent } from '../../types';
import { AUDIT_LOG_EVENTS } from '../../data/mockData';
import {
  FileCode,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Database,
  Lock
} from 'lucide-react';

interface AuditLogScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const AuditLogScreen: React.FC<AuditLogScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = AUDIT_LOG_EVENTS.filter((evt) => {
    const matchesType = filterType === 'ALL' || evt.entityType === filterType;
    const matchesSearch =
      evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Fiduciary Governance • Section 7 Requirement
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            Immutable Audit Trail Ledger
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            Cryptographically sealed operational audit events across proposals, approvals, tax scans, and custody syncs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#bbeecf]/50 border border-[#bbeecf] text-xs font-semibold text-[#002112] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#2F5D45]" />
            <span>WORM Storage Active</span>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-xl border border-[#e4e2dd] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, entity ID, or action..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#fbf9f4] border border-[#eae8e3] text-xs focus:outline-none focus:border-[#101c2d]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'RebalancingProposal', 'TaxOpportunity', 'Account', 'Document'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-[#101c2d] text-[#ffffff]'
                  : 'bg-[#f0eee9] text-[#44474c] hover:bg-[#eae8e3]'
              }`}
            >
              {t === 'ALL' ? 'All Entities' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Event Stream */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] divide-y divide-[#f0eee9] overflow-hidden shadow-xs">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="p-4 sm:p-5 hover:bg-[#fbf9f4] transition-colors space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#101c2d]">
                  {evt.id}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  evt.action === 'APPROVE' || evt.action === 'SIGN'
                    ? 'bg-[#bbeecf] text-[#002112]'
                    : evt.action === 'CREATE'
                    ? 'bg-[#d7e3fb] text-[#001b3d]'
                    : 'bg-[#ffdea4] text-[#7a5902]'
                }`}>
                  {evt.action}
                </span>
                <span className="text-[11px] font-medium text-[#75777d]">
                  on <strong>{evt.entityType}</strong> (<code>{evt.entityId}</code>)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#75777d] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{evt.createdAt}</span>
              </div>
            </div>

            <p className="text-xs text-[#1b1c19] leading-relaxed">
              {evt.details}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-[#535f73] pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-[#75777d]" />
                <span>{evt.actorName}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-[10px] text-[#75777d]">{evt.actorRole}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Compliance Box */}
      <div className="p-4 rounded-xl bg-[#f5f3ee] border border-[#eae8e3] text-xs text-[#535f73] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2F5D45]" />
          <span>Fiduciary audit trail satisfies SEC Rule 204-2 Books and Records mandate.</span>
        </div>
        <span className="font-mono text-[11px] text-[#75777d]">SHA-256 Checksum Verified</span>
      </div>

    </div>
  );
};
