import { useState, useCallback, useContext } from "react";
import { createWallet, getWalletBalance } from "thirdweb/wallets";
import { useLogger } from "./useLogger";
import { AppContext } from "../context/AppContext";

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { addLog } = useLogger();
  const { dispatch } = useContext(AppContext);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined") return null;

    try {
      setIsConnecting(true);
      const wallet = createWallet("io.metamask");

      const { address } = await wallet.connect();
      const chain = wallet.getChain()?.id || null;
      const balance = await getWalletBalance({ wallet });

      const account = { address, balance, chain };
      dispatch({ type: "SET_ACCOUNT", payload: account });

      addLog(`Connected wallet: ${address}`, "success");
      return account;
    } catch (err) {
      addLog(`Wallet connection failed: ${err.message}`, "error");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [addLog, dispatch]);

  const disconnectWallet = useCallback(() => {
    dispatch({ type: "SET_ACCOUNT", payload: null });
    addLog("Disconnected wallet", "info");
  }, [dispatch, addLog]);

  return { connectWallet, disconnectWallet, isConnecting };
}
