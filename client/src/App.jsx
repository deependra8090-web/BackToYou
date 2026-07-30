import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItemProvider, useItems } from './context/ItemContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { ItemGrid } from './components/ItemGrid';
import { InteractiveMap } from './components/InteractiveMap';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportItemModal } from './components/ReportItemModal';
import { ClaimModal } from './components/ClaimModal';
import { AIMatchModal } from './components/AIMatchModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AuthModal } from './components/AuthModal';

const MainContent = () => {
  const [currentTab, setCurrentTab] = useState('explore');
  const { activeModal } = useItems();
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main style={{ flex: 1 }}>
        {currentTab === 'explore' && (
          <>
            <HeroStats />
            <ItemGrid />
          </>
        )}

        {currentTab === 'map' && <InteractiveMap />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Render Active Modals */}
      {activeModal === 'report' && <ReportItemModal />}
      {activeModal === 'claim' && <ClaimModal />}
      {activeModal === 'aiMatch' && <AIMatchModal />}
      {activeModal === 'chat' && <ChatDrawer />}
      
      {/* Global Auth Modal */}
      <AuthModal />

      {/* Footer */}
      <footer style={{
        padding: '24px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-glass)',
        color: '#64748b',
        fontSize: '0.85rem',
        marginTop: 'auto',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>BackToYou © 2026</span>
          <span>•</span>
          <span style={{ color: '#38bdf8' }}>Smart Lost & Found Network</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#475569' }}>
          Full-Stack Lost & Found Solution with Real-Time WebSockets & Leaflet GIS Mapping
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <SocketProvider>
          <MainContent />
        </SocketProvider>
      </ItemProvider>
    </AuthProvider>
  );
}

export default App;
