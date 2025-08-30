import { useCallback, useContext } from "react";
import { AppContext } from "../context/AppContext";

export function useLogger() {
  const { dispatch } = useContext(AppContext);

  const addLog = useCallback((message, type = "info") => {
    const log = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    console.log(`[${type.toUpperCase()}]`, message);
    dispatch({ type: "ADD_LOG", payload: log });
    return log;
  }, [dispatch]);

  return { addLog };
}
