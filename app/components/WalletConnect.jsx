// src/components/WalletConnect.jsx
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { useThirdweb } from "../hooks/useThirdweb";
import { useWallet } from "../hooks/useWallet";
import * as Dialog from "@radix-ui/react-dialog";

const WalletConnect = () => {
  const { client } = useThirdweb();
  const { account, isConnecting, disconnectWallet } = useWallet();

  if (!client) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">Thirdweb client not initialized</p>
      </div>
    );
  }

  return (
    <Dialog.Root>
      {/* Trigger */}
      <Dialog.Trigger asChild>
        {account ? (
          <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
            {account.slice(0, 6)}...{account.slice(-4)}
          </button>
        ) : (
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Connect Wallet
          </button>
        )}
      </Dialog.Trigger>

      {/* Modal */}
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <Dialog.Title className="text-lg font-bold mb-4">
            {account ? "Wallet Connected" : "Select Wallet"}
          </Dialog.Title>

          {!account ? (
            <div className="space-y-4">
              {/* Thirdweb connect button */}
              <ConnectButton client={client} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 break-all font-mono">{account}</p>
              <button
                onClick={disconnectWallet}
                className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Close button */}
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              ✖
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WalletConnect;
