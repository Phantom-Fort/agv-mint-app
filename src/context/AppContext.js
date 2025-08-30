import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  wallet: null,
  selectedChain: 56,
  selectedPass: 'seed',
  quantity: 1,
  isConnecting: false,
  isMinting: false,
  logs: [],
  thirdwebSDK: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'SET_CHAIN':
      return { ...state, selectedChain: action.payload };
    case 'SET_PASS':
      return { ...state, selectedPass: action.payload };
    case 'SET_QUANTITY':
      return { ...state, quantity: action.payload };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_MINTING':
      return { ...state, isMinting: action.payload };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.payload] };
    case 'SET_SDK':
      return { ...state, thirdwebSDK: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}