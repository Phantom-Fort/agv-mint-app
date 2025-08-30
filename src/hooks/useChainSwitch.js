import { useState } from 'react';
import { useSwitchActiveWalletChain } from 'thirdweb/react';
import { defineChain } from 'thirdweb/chains';
import { CHAINS } from '../config/chains';
import { useLogger } from './useLogger';
import { useApp } from '../context/AppContext';

export function useChainSwitch() {
  const { dispatch } = useApp();
  const { addLog } = useLogger();
  const [isSwitching, setIsSwitching] = useState(false);
  const switchChain = useSwitchActiveWalletChain();

  // Define chains for Thirdweb v5
  const getThirdwebChain = (chainId) => {
    const chainConfig = CHAINS[chainId];
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    return defineChain({
      id: chainId,
      name: chainConfig.name,
      nativeCurrency: chainConfig.nativeCurrency,
      rpc: chainConfig.rpcUrl,
      blockExplorers: [
        {
          name: 'Default',
          url: chainConfig.blockExplorer
        }
      ]
    });
  };

  const switchToChain = async (targetChainId) => {
    if (!targetChainId || !CHAINS[targetChainId]) {
      throw new Error(`Invalid chain ID: ${targetChainId}`);
    }

    setIsSwitching(true);
    
    try {
      const chainConfig = CHAINS[targetChainId];
      addLog(`Switching to ${chainConfig.name}...`, 'info');

      const thirdwebChain = getThirdwebChain(targetChainId);
      await switchChain(thirdwebChain);

      dispatch({ type: 'SET_CHAIN', payload: targetChainId });
      addLog(`Successfully switched to ${chainConfig.name}`, 'success');
      
      return true;
    } catch (error) {
      if (error.code === 4001) {
        addLog('Chain switch rejected by user', 'warning');
      } else if (error.code === -32002) {
        addLog('Chain switch request pending - check your wallet', 'warning');
      } else {
        addLog(`Chain switch failed: ${error.message}`, 'error');
      }
      
      throw error;
    } finally {
      setIsSwitching(false);
    }
  };

  const addChainToWallet = async (chainId) => {
    const chainConfig = CHAINS[chainId];
    if (!chainConfig) {
      throw new Error(`Chain ${chainId} not supported`);
    }

    try {
      addLog(`Adding ${chainConfig.name} to wallet...`, 'info');
      
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainConfig.chainId,
            chainName: chainConfig.name,
            nativeCurrency: chainConfig.nativeCurrency,
            rpcUrls: [chainConfig.rpcUrl],
            blockExplorerUrls: [chainConfig.blockExplorer]
          }]
        });
        
        addLog(`${chainConfig.name} added to wallet`, 'success');
      }
    } catch (error) {
      addLog(`Failed to add chain: ${error.message}`, 'error');
      throw error;
    }
  };

  return {
    switchToChain,
    addChainToWallet,
    isSwitching,
    getThirdwebChain
  };
}