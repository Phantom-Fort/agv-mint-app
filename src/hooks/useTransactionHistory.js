import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export function useTransactionHistory() {
  const { state, dispatch } = useContext(AppContext);

  const addTransaction = (tx) =>
    dispatch({ type: "ADD_TX", payload: { ...tx, id: Date.now() } });

  const updateTransactionStatus = (id, status) =>
    dispatch({ type: "UPDATE_TX", payload: { id, status } });

  const clearHistory = () => dispatch({ type: "CLEAR_TX" });

  return {
    transactions: state.transactions || [],
    addTransaction,
    updateTransactionStatus,
    clearHistory,
  };
}
