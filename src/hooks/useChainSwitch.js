import { useCallback } from "react";
import { defineChain } from "thirdweb/chains";
import { useLogger } from "./useLogger";

// Safe chain getter
export const getThirdwebChain = (chainId) => {
  try {
    return defineChain(chainId);
  } catch {
    return null;
  }
};

export function useChainSwitch() {
  const { addLog } = useLogger();

  const switchToChain = useCallback(async (chainId) => {
    if (typeof window === "undefined" || !window.ethereum) {
      addLog("No Ethereum provider found", "error");
      return false;
    }

    try {
      const chainConfig = getThirdwebChain(chainId);
      if (!chainConfig) {
        addLog(`Unsupported chain: ${chainId}`, "error");
        return false;
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      addLog(`Switched to ${chainConfig.name}`, "success");
      return true;
    } catch (err) {
      if (err.code === 4902) {
        return await addChainToWallet(chainId);
      }
      if (err.code === 4001) {
        addLog("User rejected chain switch", "warning");
        return false;
      }
      addLog(`Error switching chain: ${err.message}`, "error");
      return false;
    }
  }, [addLog]);

  const addChainToWallet = useCallback(async (chainId) => {
    if (typeof window === "undefined" || !window.ethereum) return false;

    try {
      const chainConfig = getThirdwebChain(chainId);
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: chainConfig.name,
          nativeCurrency: chainConfig.nativeCurrency,
          rpcUrls: chainConfig.rpc,
          blockExplorerUrls: chainConfig.explorers?.map(e => e.url) || []
        }],
      });

      addLog(`Added chain ${chainConfig.name}`, "success");
      return true;
    } catch (err) {
      addLog(`Failed to add chain: ${err.message}`, "error");
      return false;
    }
  }, [addLog]);

  return { switchToChain, addChainToWallet };
}
