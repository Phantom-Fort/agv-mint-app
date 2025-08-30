import React from 'react';
import { useMinting } from '../hooks/useMinting';
import { useWallet } from '../hooks/useWallet';
import { useApp } from '../context/AppContext';
import { useContractValidation } from '../hooks/useContractValidation';

const MintButton = () => {
  const { state } = useApp();
  const { isConnected } = useWallet();
  const { mintNFTs, canMint, isMinting } = useMinting();
  const validation = useContractValidation();

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet First';
    if (isMinting) return 'Minting...';
    if (!validation.isValid) return 'Invalid Configuration';
    return `Mint ${state.quantity} ${state.selectedPass.toUpperCase()}`;
  };

  const getButtonClass = () => {
    if (!isConnected || !validation.isValid) {
      return 'btn-secondary cursor-not-allowed';
    }
    if (isMinting) {
      return 'btn-primary opacity-75 cursor-wait';
    }
    return 'btn-primary hover:scale-105 transform transition-all duration-200';
  };

  return (
    <div className="space-y-3">
      <button
        onClick={mintNFTs}
        disabled={!canMint || isMinting || !isConnected}
        className={`w-full ${getButtonClass()}`}
      >
        {isMinting && (
          <div className="inline-flex items-center">
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {getButtonText()}
          </div>
        )}
        {!isMinting && getButtonText()}
      </button>
      
      {/* Status Messages */}
      {!isConnected && (
        <div className="text-center text-sm text-gray-500">
          Please connect your wallet to continue
        </div>
      )}
      
      {isConnected && !validation.isValid && validation.errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {canMint && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-600 flex items-center space-x-2">
            <span>✅</span>
            <span>Ready to mint! All requirements met.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintButton;