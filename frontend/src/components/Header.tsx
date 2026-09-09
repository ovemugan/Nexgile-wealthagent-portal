import React, { useState } from 'react';
import { ScreenId, UserRole } from '../types';
import { HOUSEHOLD_INFO } from '../data/mockData';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  ChevronDown, 
  RefreshCw,
  User,
  Briefcase,
  Building2,
  Lock,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  activeRole,
  onSelectRole,
  onOpenSearch,
  onLogout,
  onToggleMobileNav,
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; icon: any }> = {
    client: {
      label: 'Client View: The Sterling Household',
      badge: 'Individual / Trust',
      icon: User,
    },
    advisor: {
      label: 'Advisor Workstation: Arthur Montgomery',
      badge: 'AdvisorTeam:45',
      icon: Briefcase,
    },
    sponsor: {
      label: 'Plan Sponsor: Apex Global 401(k)',
      badge: 'Sponsor Admin',
      icon: Building2,
    },
    compliance: {
      label: 'Compliance & Audit Officer',
      badge: 'SEC 206(4)-2',
      icon: Lock,
    },
  };

  const currentRoleInfo = roleLabels[activeRole];
  const RoleIcon = currentRoleInfo.icon;

  const handleRoleClick = (role: UserRole) => {
    onSelectRole(role);
    setIsRoleMenuOpen(false);
    if (role === 'advisor') {
      onNavigate('advisor_desk');
    } else if (role === 'client') {
      onNavigate('overview');
    } else if (role === 'sponsor') {
      onNavigate('retirement_plans');
    } else if (role === 'compliance') {
      onNavigate('audit_log');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#e4e2dd] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#101c2d] text-[#ffffff] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              N
            </div>
            <div>
              <div className="font-serif font-semibold tracking-wide text-sm md:text-base leading-none text-[#1b1c19] flex items-center gap-2">
                NEXGILE
                <span className="hidden sm:inline-block text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#eae8e3] text-[#44474c] font-sans font-medium">
                  WealthAgent
                </span>
              </div>
              <div className="text-[10px] text-[#75777d] font-sans hidden md:block">
                Institutional Private Wealth & Advisory
              </div>
            </div>
          </div>
        </div>

        {/* Center: Role-Based Perspective Switcher (Section 2 & 5 requirement) */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ffffff] border border-[#e4e2dd] hover:border-[#101c2d] transition-all shadow-2xs text-xs font-medium text-[#1b1c19]"
            title="Switch User Persona / Role (Section 2 & 5)"
          >
            <span className="w-2 h-2 rounded-full bg-[#2F5D45] animate-pulse shrink-0" />
            <RoleIcon className="w-3.5 h-3.5 text-[#7a5902] shrink-0" />
            <span className="hidden sm:inline truncate max-w-[210px] lg:max-w-none">
              {currentRoleInfo.label}
            </span>
            <span className="sm:hidden font-semibold">
              {activeRole.toUpperCase()}
            </span>
            <span className="hidden lg:inline text-[10px] px-1.5 py-0.2 rounded bg-[#f0eee9] text-[#535f73] font-mono">
              {currentRoleInfo.badge}
            </span>
            <ChevronDown className="w-3 h-3 text-[#75777d] shrink-0" />
          </button>

          {/* Role Dropdown Menu */}
          {isRoleMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#ffffff] rounded-2xl border border-[#e4e2dd] shadow-xl overflow-hidden z-50 p-1.5 animate-fadeIn">
              <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#75777d] border-b border-[#f0eee9]">
                Select Role & Persona (§2 Multi-Tenant)
              </div>

              <div className="space-y-1 pt-1">
                {(['client', 'advisor', 'sponsor', 'compliance'] as UserRole[]).map((role) => {
                  const info = roleLabels[role];
                  const Icon = info.icon;
                  const isSelected = activeRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleClick(role)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#101c2d] text-[#ffffff]'
                          : 'hover:bg-[#f5f3ee] text-[#1b1c19]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#ffdea4]' : 'text-[#7a5902]'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold leading-tight">{info.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#bbc7de]' : 'text-[#75777d]'}`}>
                          {info.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Tools: Search, Notifications & Custodian Lineage */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-[#535f73] hover:text-[#1b1c19] hover:bg-[#ffffff] border border-transparent hover:border-[#e4e2dd] transition-all"
            title="Search holdings, accounts, documents"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Fiduciary Notification */}
          <div className="relative">
            <button
              onClick={() => onNavigate('rebalance')}
              className="p-2 rounded-xl text-[#535f73] hover:text-[#1b1c19] hover:bg-[#ffffff] border border-transparent hover:border-[#e4e2dd] transition-all"
              title="1 Active Rebalance Directive Staged"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7a5902]" />
          </div>

          {/* Custodian Sync Badge (Data Lineage Requirement §7) */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#e4e2dd] text-xs text-[#535f73]">
            <RefreshCw className="w-3 h-3 text-[#2F5D45]" />
            <div className="text-[11px] leading-tight">
              <span className="font-medium text-[#1b1c19]">J.P. Morgan PB</span>
              <span className="text-[#75777d] block text-[10px]">Synced 09:42 EST</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-[#535f73] hover:text-[#93000a] hover:bg-[#ffdad6]/40 border border-transparent hover:border-[#f2b8b5] transition-all"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
