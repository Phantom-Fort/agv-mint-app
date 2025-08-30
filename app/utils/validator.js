// src/utils/validators.js
import { ethers } from 'ethers';
import { CHAINS } from '../config/chains';
import { USDT_ADDRESSES, NFT_CONTRACTS } from '../config/contracts';
import { PASS_PRICES } from '../config/pricing';

// Validate Ethereum address
export const isValidAddress = (address) => {
  try {
    return ethers.utils.isAddress(address);
  } catch (error) {
    return false;
  }
};

// Validate chain ID
export const isValidChainId = (chainId) => {
  return Object.keys(CHAINS).map(Number).includes(Number(chainId));
};

// Validate NFT contract address for a given chain and pass type
export const isValidContractAddress = (address, chainId, passType) => {
  if (!isValidAddress(address) || !isValidChainId(chainId) || !NFT_CONTRACTS[passType]) {
    return false;
  }
  return NFT_CONTRACTS[passType][chainId]?.toLowerCase() === address.toLowerCase();
};

// Validate USDT contract address for a given chain
export const isValidUSDTAddress = (address, chainId) => {
  if (!isValidAddress(address) || !isValidChainId(chainId)) {
    return false;
  }
  return USDT_ADDRESSES[chainId]?.toLowerCase() === address.toLowerCase();
};

// Validate minting quantity
export const isValidQuantity = (quantity, passType) => {
  if (!PASS_PRICES[passType]) {
    return false;
  }
  const num = Number(quantity);
  return Number.isInteger(num) && num >= 1 && num <= 100; // Example: max 100 per transaction
};

// Validate wallet balance for minting (requires provider)
export const isSufficientBalance = async (wallet, chainId, passType, quantity, provider) => {
  try {
    if (!isValidAddress(wallet) || !isValidChainId(chainId) || !PASS_PRICES[passType]) {
      return false;
    }
    const usdtAddress = USDT_ADDRESSES[chainId];
    const price = PASS_PRICES[passType].wei * quantity;
    
    const contract = new ethers.Contract(
      usdtAddress,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );
    const balance = await contract.balanceOf(wallet);
    return balance.gte(ethers.BigNumber.from(price));
  } catch (error) {
    console.error('Balance check failed:', error);
    return false;
  }
};

// Validate whitelist eligibility (placeholder, as whitelist.js is not provided)
export const isWhitelisted = (address, chainId, passType) => {
  // Placeholder: Implement actual whitelist check when whitelist.js is available
  return isValidAddress(address); // For now, just check if address is valid
};

// Example usage:
// import { isValidAddress, isValidQuantity } from '../utils/validators';
// console.log(isValidAddress('0x123...')); // true or false
// console.log(isValidQuantity(5, 'seed')); // true if 1 <= quantity <= 100