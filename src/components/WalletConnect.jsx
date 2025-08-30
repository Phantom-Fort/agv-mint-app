import React from 'react';
import { ConnectButton } from 'thirdweb/react';
import { useThirdweb } from '../hooks/useThirdweb';
import { useWallet } from '../hooks/useWallet';

const WalletConnect = () => {
  const { client } = useThirdweb();
  const { account, isConnecting, disconnectWallet } = useWallet();

  if (!client) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">Thirdweb client not initialized</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!account ? (
        <div className="w-full">
          <ConnectButton 
            client={client}
            theme="light"
            connectButton={{
              label: "Connect Wallet",
              style: {
                width: '100%',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }
            }}
            connectModal={{ 
              size: "wide",
              title: "Connect to AGV Mint",
              showThirdwebBranding: false
            }}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Connected</p>
                <p className="text-sm text-gray-600 font-mono">
                  {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <button
            onClick={disconnectWallet}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
      
      {isConnecting && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Connecting...</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;