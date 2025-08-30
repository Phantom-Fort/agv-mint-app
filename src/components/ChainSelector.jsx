import React from 'react';
import { useApp } from '../context/AppContext';
import { useChainSwitch } from '../hooks/useChainSwitch';
import { useWallet } from '../hooks/useWallet';
import { CHAINS } from '../config/chains';

const ChainSelector = () => {
  const { state, dispatch } = useApp();
  const { switchToChain, isSwitching } = useChainSwitch();
  const { isConnected } = useWallet();

  const handleChainChange = async (e) => {
    const newChainId = Number(e.target.value);
    
    // Update state immediately
    dispatch({ type: 'SET_CHAIN', payload: newChainId });
    
    // Switch chain if wallet is connected
    if (isConnected) {
      try {
        await switchToChain(newChainId);
      } catch (error) {
        console.error('Chain switch failed:', error);
        // Revert to previous chain on error
        // You might want to show an error message here
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Blockchain Network
      </label>
      
      <div className="relative">
        <select 
          value={state.selectedChain}
          onChange={handleChainChange}
          disabled={isSwitching}
          className="input-field appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {Object.entries(CHAINS).map(([chainId, chain]) => (
            <option key={chainId} value={chainId}>
              {chain.name} ({chain.symbol})
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isSwitching && (
        <div className="flex items-center space-x-2 text-blue-600 text-sm">
          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Switching network...</span>
        </div>
      )}
      
      {/* Chain info */}
      <div className="text-xs text-gray-500">
        Selected: {CHAINS[state.selectedChain]?.name}
      </div>
    </div>
  );
};

export default ChainSelector;