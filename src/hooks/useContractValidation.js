import { useEffect } from "react";
import { useLogger } from "./useLogger";

export function useContractValidation(state) {
  const { addLog } = useLogger();

  useEffect(() => {
    if (!state.contract) {
      addLog("Contract not loaded", "error");
      return;
    }

    if (!state.usdtContract) {
      addLog("USDT contract not loaded", "error");
      return;
    }

    if (!state.passType) {
      addLog("No pass type selected", "error");
      return;
    }

    if (state.quantity < 1) {
      addLog("Quantity must be at least 1", "error");
      return;
    }

    if (state.quantity > 5) {
      addLog("Quantity cannot exceed 5", "error");
      return;
    }

    addLog("Contract validation passed", "success");
  }, [state, addLog]);
}
