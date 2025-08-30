import React from 'react';
import { AppProvider } from './context/AppContext';
import WalletConnect from './components/WalletConnect';
import ChainSelector from './components/ChainSelector';
import PassSelector from './components/PassSelector';
import QuantityInput from './components/QuantityInput';
import MintButton from './components/MintButton';
import ActivityLog from './components/ActivityLog';
import StatusBadge from './components/StatusBadge';
import './styles/globals.css';
import './styles/components.css';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AGV Multi-Chain Mint
            </h1>
            <div className="flex gap-3 flex-wrap">
              <StatusBadge chain="BNB" id="56" />
              <StatusBadge chain="Polygon" id="137" />
              <StatusBadge chain="Arbitrum" id="42161" />
              <StatusBadge special="Payment: USDT" />
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Mint Configuration</h2>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <ChainSelector />
                  <PassSelector />
                  <QuantityInput />
                </div>

                <div className="space-y-4">
                  <WalletConnect />
                  <MintButton />
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;