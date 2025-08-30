import React from 'react';
import { useApp } from '../context/AppContext';
import { useWallet } from '../hooks/useWallet';

const StatusBadge = ({ chain, id, special }) => {
  const { state } = useApp();
  const { isConnected, wallet } = useWallet();

  // Special badges (like "Payment: USDT")
  if (special) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
        {special}
      </span>
    );
  }

  // Chain badges
  const isSelected = Number(id) === state.selectedChain;
  const isConnectedToChain = isConnected && wallet?.chainId === Number(id);
  
  const getBadgeClass = () => {
    if (isConnectedToChain) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (isSelected) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusIcon = () => {
    if (isConnectedToChain) return '🟢';
    if (isSelected) return '🔵';
    return '⚪';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getBadgeClass()}`}>
      <span className="mr-1">{getStatusIcon()}</span>
      {chain} ({id})
      {isConnectedToChain && <span className="ml-1 text-xs">Connected</span>}
      {isSelected && !isConnectedToChain && <span className="ml-1 text-xs">Selected</span>}
    </span>
  );
};

export default StatusBadge;