import { useState } from 'react';
import { approve } from 'thirdweb/extensions/erc20';
import { claimTo } from 'thirdweb/extensions/erc721';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { useThirdweb } from './useThirdweb';
import { useChainSwitch } from './useChainSwitch';
import { useLogger } from './useLogger';
import { useApp } from '../context/AppContext';
import { NFT_CONTRACTS, USDT_ADDRESSES } from '../config/contracts';
import { PASS_PRICES } from '../config/pricing';
import { WHITELIST } from '../config/whitelist';

export function useMinting() {
  const { state, dispatch } = useApp();
  const { client, getContractInstance } = useThirdweb();
  const { switchToChain } = useChainSwitch();
  const { addLog } = useLogger();
  const account = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();
  const [isMinting, setIsMinting] = useState(false);

  const validateMintParams = (chainId, passType, quantity) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    const contractAddress = NFT_CONTRACTS[passType]?.[chainId];
    const usdtAddress = USDT_ADDRESSES[chainId];
    const price = PASS_PRICES[passType];

    if (!contractAddress || contractAddress === "0x...") {
      throw new Error(`${passType} pass not available on this chain`);
    }

    if (!usdtAddress) {
      throw new Error('USDT not supported on this chain');
    }

    if (!price || quantity < 1 || quantity > 5) {
      throw new Error('Invalid quantity (1-5 allowed)');
    }

    return { contractAddress, usdtAddress, price };
  };

  const getWhitelistProof = (address) => {
    return WHITELIST.proofs[address] || [];
  };

  const approveUSDT = async (usdtContract, spender, amount) => {
    try {
      addLog('Approving USDT spend...', 'info');
      
      const transaction = approve({
        contract: usdtContract,
        spender,
        amount
      });

      await sendTx(transaction);
      addLog('USDT approval successful', 'success');
    } catch (error) {
      addLog(`USDT approval failed: ${error.message}`, 'error');
      throw error;
    }
  };

  const executeMint = async (nftContract, recipient, quantity, options) => {
    try {
      addLog('Executing mint transaction...', 'info');

      const transaction = claimTo({
        contract: nftContract,
        to: recipient,
        quantity,
        ...options
      });

      const result = await sendTx(transaction);
      addLog(`Mint successful! Transaction: ${result.transactionHash}`, 'success');
      
      return result;
    } catch (error) {
      addLog(`Mint transaction failed: ${error.message}`, 'error');
      throw error;
    }
  };

  const mintNFTs = async () => {
    if (!client || !account) {
      addLog('Wallet not connected', 'error');
      return;
    }

    const { selectedChain, selectedPass, quantity } = state;
    
    setIsMinting(true);
    dispatch({ type: 'SET_MINTING', payload: true });

    try {
      // Validate parameters
      const { contractAddress, usdtAddress, price } = validateMintParams(
        selectedChain, 
        selectedPass, 
        quantity
      );

      addLog(`Starting mint: ${quantity} ${selectedPass} pass(es)`, 'info');

      // Ensure correct chain
      await switchToChain(selectedChain);

      // Get contract instances
      addLog('Loading contracts...', 'info');
      const nftContract = await getContractInstance(contractAddress, selectedChain);
      const usdtContract = await getContractInstance(usdtAddress, selectedChain);

      // Calculate total price
      const totalPrice = window.BigInt(price.wei) * window.BigInt(quantity);
      
      // Get whitelist proof
      const proofs = getWhitelistProof(account.address);
      if (proofs.length > 0) {
        addLog('Whitelist proof found', 'info');
      }

      // Approve USDT spending
      await approveUSDT(usdtContract, contractAddress, totalPrice);

      // Wait a moment for approval to confirm
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Execute mint
      const mintOptions = {
        currencyAddress: usdtAddress,
        pricePerToken: price.wei,
        proofs: proofs
      };

      const result = await executeMint(
        nftContract, 
        account.address, 
        quantity, 
        mintOptions
      );

      addLog('🎉 Mint completed successfully!', 'success');
      addLog('Check your wallet for new NFTs', 'success');

      return result;

    } catch (error) {
      const errorMsg = error.reason || error.message || 'Unknown error';
      addLog(`Mint failed: ${errorMsg}`, 'error');
      console.error('Mint error details:', error);
      throw error;
    } finally {
      setIsMinting(false);
      dispatch({ type: 'SET_MINTING', payload: false });
    }
  };

  const canMint = () => {
    const { selectedChain, selectedPass, quantity } = state;
    
    if (!account || isMinting) return false;
    
    try {
      validateMintParams(selectedChain, selectedPass, quantity);
      return true;
    } catch {
      return false;
    }
  };

  return {
    mintNFTs,
    isMinting,
    canMint: canMint(),
    validateMintParams,
    getWhitelistProof
  };
}