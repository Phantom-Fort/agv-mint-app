import { useApp } from '../context/AppContext';
import { useCallback } from 'react';

export function useLogger() {
  const { dispatch } = useApp();

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    dispatch({
      type: 'ADD_LOG',
      payload: { timestamp, message, type }
    });
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, [dispatch]);

  return { addLog };
}