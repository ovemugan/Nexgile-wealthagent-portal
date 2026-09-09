import React, { useState } from 'react';
import { ScreenId, VaultDocument } from '../../types';
import { HOUSEHOLD_INFO, VAULT_DOCUMENTS } from '../../data/mockData';
import { useAppData } from '../../data/AppDataContext';
import {
  ShieldCheck,
  FileText,
  Download,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Eye,
  FileUp
} from 'lucide-react';

interface VaultScreenProps {
  onNavigate: (screen: ScreenId) => void;
  isMobileView?: boolean;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({
  onNavigate,
  isMobileView = false,
}) => {
  const { householdInfo: HOUSEHOLD_INFO, documents: VAULT_DOCUMENTS } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [verifiedDoc, setVerifiedDoc] = useState<string | null>(null);

  const filteredDocs = VAULT_DOCUMENTS.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.custodian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setVerifiedDoc(id);
      setTimeout(() => setVerifiedDoc(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#75777d]">
            Sovereign Depository • Encrypted Archive
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1b1c19] tracking-tight mt-0.5">
            Fiduciary Document Vault
          </h1>
          <p className="text-xs text-[#535f73] mt-0.5">
            Verified tax returns, custodial ledger statements, and trust instruments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#bbeecf]/50 border border-[#bbeecf] text-xs font-semibold text-[#002112]">
            <Lock className="w-3.5 h-3.5 text-[#2F5D45]" />
            <span>256-Bit Custodial Encryption</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-xl border border-[#e4e2dd] shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, tax year, or custodian..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#fbf9f4] border border-[#eae8e3] text-xs focus:outline-none focus:border-[#101c2d]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Tax Document', 'Trust Agreement', 'Fiduciary Letter', 'Custody Report'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#101c2d] text-[#ffffff]'
                  : 'bg-[#f0eee9] text-[#44474c] hover:bg-[#eae8e3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Document Items List */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2dd] divide-y divide-[#f0eee9] overflow-hidden shadow-xs">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 hover:bg-[#fbf9f4] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#f0eee9] text-[#101c2d] shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-[#7a5902]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-xs text-[#1b1c19] hover:text-[#7a5902] transition-colors">
                    {doc.title}
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#eae8e3] text-[#535f73]">
                    {doc.fileFormat}
                  </span>
                </div>
                <div className="text-[11px] text-[#75777d] mt-1 flex flex-wrap items-center gap-3">
                  <span>{doc.custodian}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[#2F5D45] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {doc.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleDownload(doc.id, doc.title)}
                disabled={downloadingId === doc.id}
                className="px-3 py-1.5 rounded-lg bg-[#f0eee9] hover:bg-[#101c2d] hover:text-[#ffffff] text-xs font-semibold text-[#1b1c19] transition-all flex items-center gap-1.5"
              >
                {downloadingId === doc.id ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#101c2d] border-t-transparent rounded-full animate-spin" />
                    <span>Decrypting...</span>
                  </>
                ) : verifiedDoc === doc.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
                    <span>Verified & Decrypted</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custody Certification Footer Note */}
      <div className="p-4 rounded-xl bg-[#f5f3ee] border border-[#eae8e3] text-xs text-[#535f73] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2F5D45]" />
          <span>All documents cryptographically signed & timestamped by Nexgile Private Ledger.</span>
        </div>
        <span className="font-mono text-[11px] text-[#75777d]">SHA-256 Validated</span>
      </div>

    </div>
  );
};
