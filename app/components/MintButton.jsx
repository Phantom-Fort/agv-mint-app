// src/components/MintButton.jsx
import React from "react";
import * as Button from "@radix-ui/react-slot";
import { useMinting } from "../hooks/useMinting";
import { useWallet } from "../hooks/useWallet";
import { useApp } from "../context/AppContext";
import { useContractValidation } from "../hooks/useContractValidation";

const MintButton = () => {
  const { state } = useApp();
  const { isConnected } = useWallet();
  const { mintNFTs, canMint, isMinting } = useMinting();
  const validation = useContractValidation();

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet First";
    if (isMinting) return "Minting...";
    if (!validation.isValid) return "Invalid Configuration";
    return `Mint ${state.quantity} ${state.selectedPass.toUpperCase()}`;
  };

  return (
    <div className="space-y-3">
      <Button.Slot
        asChild
      >
        <button
          onClick={mintNFTs}
          disabled={!canMint || isMinting || !isConnected}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
            !isConnected || !validation.isValid
              ? "bg-gray-400 cursor-not-allowed"
              : isMinting
              ? "bg-blue-500 opacity-75 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 transition"
          }`}
        >
          {isMinting ? (
            <div className="inline-flex items-center">
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {getButtonText()}
            </div>
          ) : (
            getButtonText()
          )}
        </button>
      </Button.Slot>

      {!isConnected && (
        <div className="text-center text-sm text-gray-500">
          Please connect your wallet to continue
        </div>
      )}

      {isConnected && !validation.isValid && validation.errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>                  
                  <img
                    src="https://img.icons8.com/?size=100&id=360&format=png&color=000000"
                    alt="Error Icon"
                  /></span>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {canMint && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-600 flex items-center space-x-2">
            <span>                  
              <img
                src="https://img.icons8.com/?size=100&id=25534&format=png&color=000000"
                alt="Success Icon"
              /></span>
            <span>Ready to mint! All requirements met.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintButton;
