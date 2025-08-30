// src/utils/formatters.js
import { ethers } from 'ethers';
import { PASS_PRICES, PASS_DETAILS } from '../config/pricing';
import { CHAINS } from '../config/chains';

// Shorten wallet address for display (e.g., 0x123...4567)
export const formatAddress = (address) => {
  if (!ethers.utils.isAddress(address)) {
    return 'Invalid Address';
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format cryptocurrency amount (Wei to USDT or native currency)
export const formatAmount = (weiAmount, chainId, decimals = 6) => {
  try {
    const amount = ethers.utils.formatUnits(weiAmount, decimals); // USDT has 6 decimals
    const symbol = chainId && CHAINS[chainId]?.symbol ? CHAINS[chainId].symbol : 'USDT';
    return `${parseFloat(amount).toFixed(2)} ${symbol}`;
  } catch (error) {
    return '0.00';
  }
};

// Format pass price for display
export const formatPassPrice = (passType, chainId) => {
  if (!PASS_PRICES[passType] || !CHAINS[chainId]) {
    return 'N/A';
  }
  const { usd, wei } = PASS_PRICES[passType];
  return `${usd} USD (${formatAmount(wei, chainId)})`;
};

// Format pass name and description
export const formatPassDetails = (passType) => {
  if (!PASS_DETAILS[passType]) {
    return { name: 'Unknown', description: 'N/A' };
  }
  return {
    name: PASS_DETAILS[passType].name,
    description: PASS_DETAILS[passType].description,
  };
};

// Format timestamp for logs
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format transaction hash for display
export const formatTxHash = (txHash) => {
  if (!txHash || typeof txHash !== 'string') {
    return 'N/A';
  }
  return `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
};

// Example usage:
// import { formatAddress, formatAmount } from '../utils/formatters';
// console.log(formatAddress('0x1234567890abcdef1234567890abcdef12345678')); // 0x1234...5678
// console.log(formatAmount(29000000, 56)); // 29.00 USDT