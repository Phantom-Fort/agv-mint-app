import { useState, useEffect, useMemo } from 'react';
import { createThirdwebClient, getContract } from 'thirdweb';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { CLIENT_ID } from '../config/contracts';
import { useLogger } from './useLogger';

export function useThirdweb() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { addLog } = useLogger();

  // Create Thirdweb client (memoized to prevent recreating)
  const client = useMemo(() => {
    try {
      const thirdwebClient = createThirdwebClient({
        clientId: CLIENT_ID
      });
      addLog('Thirdweb client initialized', 'success');
      return thirdwebClient;
    } catch (error) {
      addLog(`Failed to create Thirdweb client: ${error.message}`, 'error');
      return null;
    }
  }, [addLog]);

  // Get active wallet and account
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  useEffect(() => {
    if (client) {
      setIsInitialized(true);
    }
  }, [client]);

  // Get contract helper
  const getContractInstance = async (address, chainId) => {
    if (!client || !address) {
      throw new Error('Client not initialized or invalid address');
    }

    try {
      const contract = getContract({
        client,
        address,
        chain: chainId
      });
      return contract;
    } catch (error) {
      addLog(`Failed to get contract: ${error.message}`, 'error');
      throw error;
    }
  };

  return {
    client,
    isInitialized,
    wallet,
    account,
    getContractInstance
  };
}
