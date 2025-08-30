import { useState, useCallback } from "react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { useLogger } from "./useLogger";
import { useTransactionHistory } from "./useTransactionHistory";

export function useMinting(contract, usdtContract) {
  const [isMinting, setIsMinting] = useState(false);
  const { addLog } = useLogger();
  const { addTransaction, updateTransactionStatus } = useTransactionHistory();

  const validateMintParams = (params) => {
    if (!contract || !usdtContract) {
      addLog("Contracts not ready", "error");
      return false;
    }
    if (!params.account) {
      addLog("Wallet not connected", "error");
      return false;
    }
    if (params.quantity < 1 || params.quantity > 5) {
      addLog("Quantity must be 1-5", "error");
      return false;
    }
    return true;
  };

  const mintNFTs = useCallback(async (params) => {
    if (!validateMintParams(params)) return false;

    try {
      setIsMinting(true);
      addLog(`Minting ${params.quantity} NFTs...`, "info");

      // USDT approval
      const totalCost = BigInt(params.price) * BigInt(params.quantity);
      const approveTx = prepareContractCall({
        contract: usdtContract,
        method: "approve",
        params: [contract.address, totalCost],
      });

      await sendTransaction({ transaction: approveTx });
      addLog("USDT approved", "success");

      // Mint
      const mintTx = prepareContractCall({
        contract,
        method: "mintNFT",
        params: [params.account, params.quantity, params.proof || []],
      });

      const receipt = await sendTransaction({ transaction: mintTx });
      addTransaction({ hash: receipt.transactionHash, status: "success" });

      addLog(`Mint successful! Tx: ${receipt.transactionHash}`, "success");
      return true;
    } catch (err) {
      addLog(`Mint failed: ${err.message}`, "error");
      return false;
    } finally {
      setIsMinting(false);
    }
  }, [contract, usdtContract, addLog, addTransaction]);

  return { mintNFTs, isMinting };
}
