import React from 'react';
import { ScreenId, UserRole } from '../types';
import { HOUSEHOLD_INFO } from '../data/mockData';
import {
  LayoutDashboard,
  WalletCards,
  TrendingUp,
  Scale,
  ShieldCheck,
  Flame,
  Briefcase,
  Building2,
  FileCode,
  Phone,
  Lock,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  activeRole?: UserRole;
  pendingRebalanceCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  activeRole = 'client',
  pendingRebalanceCount = 4,
}) => {
  const primaryNavItems = [
    {
      id: 'overview' as ScreenId,
      label: 'Wealth Overview',
      subtitle: 'Net Worth & Allocation',
      icon: LayoutDashboard,
      module: 'Module A',
    },
    {
      id: 'holdings' as ScreenId,
      label: 'Holdings & Accounts',
      subtitle: 'Custodial Position Books',
      icon: WalletCards,
      badge: '28 Assets',
      module: 'Module A',
    },
    {
      id: 'scenarios' as ScreenId,
      label: 'Goals & Scenarios',
      subtitle: 'Monte Carlo 10k Simulator',
      icon: TrendingUp,
      badge: '91% Conf.',
      module: 'Module A',
    },
    {
      id: 'tax' as ScreenId,
      label: 'Tax-Loss & Giving',
      subtitle: 'Wash-Sale Detection §1091',
      icon: Flame,
      alertBadge: '1 Flagged',
      module: 'Module B',
    },
    {
      id: 'vault' as ScreenId,
      label: 'Document Vault',
      subtitle: 'Tax & Depository Archive',
      icon: ShieldCheck,
      badge: '256-Bit',
      module: 'Module A',
    },
  ];

  const institutionalNavItems = [
    {
      id: 'advisor_desk' as ScreenId,
      label: 'Advisor Workstation',
      subtitle: 'Book of Business (360)',
      icon: Briefcase,
      badge: '3 Clients',
      module: 'Module E',
    },
    {
      id: 'rebalance' as ScreenId,
      label: 'Directive RP-2024-09',
      subtitle: 'Tactical Rebalance Staging',
      icon: Scale,
      alertBadge: pendingRebalanceCount > 0 ? `${pendingRebalanceCount} Staged` : undefined,
      module: 'Module E',
    },
    {
      id: 'retirement_plans' as ScreenId,
      label: 'Institutional 401(k)',
      subtitle: 'Sponsor & Participant Portal',
      icon: Building2,
      badge: 'ERISA',
      module: 'Module C/D',
    },
    {
      id: 'audit_log' as ScreenId,
      label: 'Immutable Audit Log',
      subtitle: 'SEC 204-2 Books & Records',
      icon: FileCode,
      module: 'Section 7',
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#ffffff] border-r border-[#e4e2dd] min-h-[calc(100vh-61px)] flex flex-col justify-between p-3.5 select-none">
      
      {/* Top Nav List */}
      <div className="space-y-5">
        
        {/* Mandate badge */}
        <div className="p-3 bg-[#f5f3ee] rounded-xl border border-[#eae8e3]">
          <div className="flex items-center justify-between text-[10px] text-[#75777d] uppercase tracking-wider font-semibold">
            <span>Fiduciary Mandate</span>
            <span className="text-[#2F5D45] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D45]" />
              Active
            </span>
          </div>
          <div className="mt-1 text-xs font-serif font-bold text-[#1b1c19] truncate">
            {HOUSEHOLD_INFO.primaryTrust}
          </div>
          <div className="text-[10px] text-[#535f73] mt-0.5">
            Core Growth & Preservation Model
          </div>
        </div>

        {/* Section 1: Client Wealth Management (Module A & B) */}
        <nav className="space-y-1">
          <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#75777d]">
            Private Wealth (Module A & B)
          </div>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#101c2d] text-[#ffffff] shadow-xs'
                    : 'text-[#44474c] hover:bg-[#f5f3ee] hover:text-[#1b1c19]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#ffdea4]' : 'text-[#75777d] group-hover:text-[#1b1c19]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="leading-snug truncate">{item.label}</div>
                    <div
                      className={`text-[10px] leading-none truncate ${
                        isActive ? 'text-[#bbc7de]' : 'text-[#8c9099]'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                {item.alertBadge && (
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-[#fcce73] text-[#775600]'
                        : 'bg-[#ffdad6] text-[#93000a]'
                    }`}
                  >
                    {item.alertBadge}
                  </span>
                )}
                {item.badge && !item.alertBadge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded shrink-0 ${
                      isActive
                        ? 'bg-[#1b2a41] text-[#bbc7de]'
                        : 'bg-[#eae8e3] text-[#535f73]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Section 2: Advisor & Institutional (Modules C, D, E & Section 7) */}
        <nav className="space-y-1 pt-2 border-t border-[#f0eee9]">
          <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#75777d]">
            Advisor & Institutional (C, D, E)
          </div>
          {institutionalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#101c2d] text-[#ffffff] shadow-xs'
                    : 'text-[#44474c] hover:bg-[#f5f3ee] hover:text-[#1b1c19]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#ffdea4]' : 'text-[#75777d] group-hover:text-[#1b1c19]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="leading-snug truncate">{item.label}</div>
                    <div
                      className={`text-[10px] leading-none truncate ${
                        isActive ? 'text-[#bbc7de]' : 'text-[#8c9099]'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                {item.alertBadge && (
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-[#fcce73] text-[#775600]'
                        : 'bg-[#ffdea4] text-[#7a5902]'
                    }`}
                  >
                    {item.alertBadge}
                  </span>
                )}
                {item.badge && !item.alertBadge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded shrink-0 ${
                      isActive
                        ? 'bg-[#1b2a41] text-[#bbc7de]'
                        : 'bg-[#eae8e3] text-[#535f73]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom: Dedicated Advisor Concierge */}
      <div className="pt-3 border-t border-[#e4e2dd]">
        <div className="p-2.5 rounded-xl bg-[#f5f3ee] border border-[#eae8e3]">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-[#101c2d] text-[#ffffff] flex items-center justify-center font-serif text-[11px] font-bold shrink-0">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#1b1c19] truncate">
                  {HOUSEHOLD_INFO.advisorName}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D45]" title="Online" />
              </div>
              <div className="text-[10px] text-[#75777d] truncate">
                {HOUSEHOLD_INFO.advisorRole}
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-[#eae8e3] flex items-center justify-between">
            <a
              href={`tel:${HOUSEHOLD_INFO.advisorPhone}`}
              className="flex items-center gap-1 text-[10px] text-[#101c2d] font-medium hover:underline"
            >
              <Phone className="w-3 h-3 text-[#7a5902]" />
              <span>Direct Line</span>
            </a>
            <span className="text-[9px] text-[#75777d]">NYC Advisory</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
