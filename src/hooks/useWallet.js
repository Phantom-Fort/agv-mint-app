import { useState, useEffect } from 'react';
import { useActiveAccount, useActiveWallet, useConnect, useDisconnect } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { useLogger } from './useLogger';
import { useApp } from '../context/AppContext';
import { useThirdweb } from './useThirdweb';

export function useWallet() {
  const { state, dispatch } = useApp();
  const { addLog } = useLogger();
  const [isConnecting, setIsConnecting] = useState(false);
  const thirdweb = useThirdweb();

  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Update app state when wallet changes
  useEffect(() => {
    if (account && wallet) {
      const walletData = {
        address: account.address,
        chainId: wallet.getChain()?.id || null,
        isConnected: true
      };
      
      dispatch({ type: 'SET_WALLET', payload: walletData });
      addLog(`Wallet connected: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`, 'success');
    } else {
      dispatch({ type: 'SET_WALLET', payload: null });
    }
  }, [account, wallet, dispatch, addLog]);

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    dispatch({ type: 'SET_CONNECTING', payload: true });
    
    try {
      addLog('Connecting wallet...', 'info');

      // Create injected wallet (MetaMask, etc.)
      const injectedWallet = createWallet('io.metamask');
      await connect(async () => {
        await injectedWallet.connect({ client: thirdweb.client });
        return injectedWallet;
      });

      addLog('Wallet connection successful', 'success');
    } catch (error) {
      addLog(`Wallet connection failed: ${error.message}`, 'error');
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      addLog('Disconnecting wallet...', 'info');
      await disconnect(wallet);
      dispatch({ type: 'SET_WALLET', payload: null });
      addLog('Wallet disconnected', 'warning');
    } catch (error) {
      addLog(`Disconnect failed: ${error.message}`, 'error');
    }
  };

  return {
    account,
    wallet,
    isConnecting: isConnecting || state.isConnecting,
    isConnected: !!account,
    connectWallet,
    disconnectWallet
  };
}