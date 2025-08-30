// context/AppContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { useAddress, useChain } from '@thirdweb-dev/react';
import { client, contract } from '@/lib/thirdweb';

const AppContext = createContext();

const initialState = {
  wallet: null,              // Connected wallet address
  chain: null,               // Current chain info
  isConnecting: false,       // Wallet connection flag
  role: 'guest',            // "guest" | "public" | "whitelisted" | "kol"
  logs: [],                 // Activity log entries
  transactions: [],         // Tx history
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'SET_CHAIN':
      return { ...state, chain: action.payload };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.payload] };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    case 'ADD_TX':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'CLEAR_TXS':
      return { ...state, transactions: [] };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const address = useAddress(); // Thirdweb hook for wallet address
  const chain = useChain();     // Thirdweb hook for chain info

  // Sync Thirdweb wallet and chain with context
  useEffect(() => {
    dispatch({ type: 'SET_WALLET', payload: address || null });
    dispatch({ type: 'SET_CHAIN', payload: chain || null });
    if (address) {
      verifyRole(address);
    } else {
      dispatch({ type: 'SET_ROLE', payload: 'guest' });
    }
  }, [address, chain]);

  // ---- Helpers ----
  const addLog = (message, type = 'info') => {
    dispatch({
      type: 'ADD_LOG',
      payload: {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toLocaleTimeString(),
      },
    });
  };

  const clearLogs = () => dispatch({ type: 'CLEAR_LOGS' });

  const addTx = (tx) => {
    dispatch({
      type: 'ADD_TX',
      payload: {
        id: Date.now(),
        ...tx,
      },
    });
  };

  const clearTxs = () => dispatch({ type: 'CLEAR_TXS' });

  // ---- Role Verifier ----
  const verifyRole = async (wallet) => {
    if (!wallet) {
      dispatch({ type: 'SET_ROLE', payload: 'guest' });
      return;
    }

    try {
      const [whitelistRes, kolRes] = await Promise.all([
        fetch(`/api/check-whitelist?wallet=${wallet}`),
        fetch(`/api/check-kol?wallet=${wallet}`),
      ]);

      const whitelistData = await whitelistRes.json();
      const kolData = await kolRes.json();

      if (kolData?.isKOL) {
        dispatch({ type: 'SET_ROLE', payload: 'kol' });
      } else if (whitelistData?.isWhitelisted) {
        dispatch({ type: 'SET_ROLE', payload: 'whitelisted' });
      } else {
        dispatch({ type: 'SET_ROLE', payload: 'public' });
      }
    } catch (err) {
      console.error('Role check failed:', err);
      dispatch({ type: 'SET_ROLE', payload: 'public' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addLog,
        clearLogs,
        addTx,
        clearTxs,
        verifyRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);