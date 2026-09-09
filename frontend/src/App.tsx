import React, { useEffect, useState } from 'react';
import { ScreenId, UserRole } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchDialog } from './components/SearchDialog';

import { OverviewScreen } from './components/screens/OverviewScreen';
import { HoldingsScreen } from './components/screens/HoldingsScreen';
import { ScenariosScreen } from './components/screens/ScenariosScreen';
import { TaxScreen } from './components/screens/TaxScreen';
import { RebalanceScreen } from './components/screens/RebalanceScreen';
import { AdvisorDeskScreen } from './components/screens/AdvisorDeskScreen';
import { VaultScreen } from './components/screens/VaultScreen';
import { RetirementPlanScreen } from './components/screens/RetirementPlanScreen';
import { AuditLogScreen } from './components/screens/AuditLogScreen';
import { AppDataProvider, fetchAppData, fallback, AppData } from './data/AppDataContext';
import { login } from './api';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [activeRole, setActiveRole] = useState<UserRole>('client');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [appData, setAppData] = useState<AppData>(fallback);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const start = async () => {
      try {
        setAppData(await fetchAppData());
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('nexgile_access_token');
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    };
    void start();
  }, []);

  const handleAuthenticated = async () => {
    setAppData(await fetchAppData());
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexgile_access_token');
    setIsSearchOpen(false);
    setCurrentScreen('overview');
    setIsAuthenticated(false);
  };

  if (isCheckingSession) {
    return <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center text-sm text-[#535f73]">Loading secure workspace…</div>;
  }
  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={handleAuthenticated} />;
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'overview':
        return <OverviewScreen onNavigate={setCurrentScreen} />;
      case 'holdings':
        return <HoldingsScreen onNavigate={setCurrentScreen} />;
      case 'scenarios':
        return <ScenariosScreen onNavigate={setCurrentScreen} />;
      case 'tax':
        return <TaxScreen onNavigate={setCurrentScreen} />;
      case 'rebalance':
        return <RebalanceScreen onNavigate={setCurrentScreen} />;
      case 'advisor_desk':
        return <AdvisorDeskScreen onNavigate={setCurrentScreen} />;
      case 'vault':
        return <VaultScreen onNavigate={setCurrentScreen} />;
      case 'retirement_plans':
        return <RetirementPlanScreen onNavigate={setCurrentScreen} />;
      case 'audit_log':
        return <AuditLogScreen onNavigate={setCurrentScreen} />;
      default:
        return <OverviewScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <AppDataProvider value={appData}>
    <div className="min-h-screen bg-[#fbf9f4] text-[#1b1c19] flex flex-col font-sans selection:bg-[#fcce73]/40 selection:text-[#261900]">
      
      {/* Top Application Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Responsive Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar (visible on lg and above) */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            activeRole={activeRole}
          />
        </div>

        {/* Main Viewport Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0">
          {renderActiveScreen()}
        </main>

      </div>

      {/* Mobile Bottom Navigation (Visible on mobile/tablet viewports < lg) */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Global Quick Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentScreen}
      />

    </div>
    </AppDataProvider>
  );
}
