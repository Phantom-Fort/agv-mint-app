import { useState, useCallback } from 'react';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = useCallback((txData) => {
    const transaction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      hash: txData.hash,
      status: 'pending',
      chain: txData.chain,
      pass: txData.pass,
      quantity: txData.quantity,
      price: txData.price
    };

    setTransactions(prev => [transaction, ...prev]);
    return transaction.id;
  }, []);

  const updateTransactionStatus = useCallback((id, status, receipt = null) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === id 
        ? { ...tx, status, receipt, updatedAt: new Date().toISOString() }
        : tx
    ));
  }, []);

  const clearHistory = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    transactions,
    addTransaction,
    updateTransactionStatus,
    clearHistory
  };
}