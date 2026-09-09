import React, { useState } from 'react';
import { ScreenId } from '../types';
import {
  LayoutDashboard,
  WalletCards,
  TrendingUp,
  Scale,
  Flame,
  MoreHorizontal,
  ShieldCheck,
  Building2,
  Briefcase,
  FileCode,
  X
} from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  pendingRebalanceCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  pendingRebalanceCount = 4,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'overview' as ScreenId, label: 'Overview', icon: LayoutDashboard },
    { id: 'holdings' as ScreenId, label: 'Holdings', icon: WalletCards },
    { id: 'scenarios' as ScreenId, label: 'Scenarios', icon: TrendingUp },
    { id: 'tax' as ScreenId, label: 'Tax-Loss', icon: Flame, badge: '§1091' },
    { id: 'rebalance' as ScreenId, label: 'Rebalance', icon: Scale, hasBadge: pendingRebalanceCount > 0 },
  ];

  const moreItems = [
    { id: 'advisor_desk' as ScreenId, label: 'Advisor Workstation (Book of Business)', icon: Briefcase, desc: 'Client 360 & Risk Profiler' },
    { id: 'vault' as ScreenId, label: 'Fiduciary Document Vault', icon: ShieldCheck, desc: 'Encrypted tax & trust repository' },
    { id: 'retirement_plans' as ScreenId, label: 'Institutional 401(k) Portal', icon: Building2, desc: 'Sponsor & Participant oversight' },
    { id: 'audit_log' as ScreenId, label: 'Immutable Audit Trail', icon: FileCode, desc: 'SEC Rule 204-2 Books & Records' },
  ];

  return (
    <>
      {/* More Drawer Modal for Mobile */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex flex-col justify-end p-2 sm:p-4">
          <div className="bg-[#ffffff] rounded-2xl p-4 space-y-3 max-w-lg w-full mx-auto shadow-2xl border border-[#e4e2dd]">
            <div className="flex items-center justify-between border-b border-[#f0eee9] pb-2">
              <span className="font-serif font-bold text-sm text-[#1b1c19]">
                More Sovereign Modules
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg hover:bg-[#f0eee9] text-[#75777d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMoreOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-all ${
                      isActive ? 'bg-[#101c2d] text-[#ffffff]' : 'hover:bg-[#f5f3ee] text-[#1b1c19]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ffdea4]' : 'text-[#7a5902]'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs leading-tight">{item.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-[#bbc7de]' : 'text-[#75777d]'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar for Mobile Viewports */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e4e2dd] px-2 py-1.5 transition-all lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 relative rounded-xl transition-all ${
                  isActive
                    ? 'text-[#101c2d]'
                    : 'text-[#75777d] hover:text-[#1b1c19]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-[#101c2d]' : ''}`} />
                  {tab.hasBadge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  )}
                  {tab.badge && !tab.hasBadge && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-mono px-1 rounded bg-[#bbeecf] text-[#002112]">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium leading-none ${
                    isActive ? 'font-bold text-[#101c2d]' : 'text-[#75777d]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 relative rounded-xl transition-all ${
              moreItems.some(i => i.id === currentScreen)
                ? 'text-[#101c2d]'
                : 'text-[#75777d] hover:text-[#1b1c19]'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="text-[10px] mt-1 font-medium leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
