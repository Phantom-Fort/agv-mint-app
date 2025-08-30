import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import GuestLanding from './pages/GuestLanding';
import MintDashboard from './pages/MintDashboard';
import KOLDashboard from './pages/KOLDashboard';

function AppContent() {
  const { state, verifyRole } = useApp();

  useEffect(() => {
    if (state.wallet) {
      verifyRole(state.wallet); // hits both APIs internally
    }
  }, [state.wallet]);

  if (!state.wallet) {
    return <GuestLanding />;
  }

  if (state.role === "kol") {
    return <KOLDashboard />;
  }

  // Both whitelisted and public use the same MintDashboard
  return <MintDashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
