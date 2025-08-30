import React, { useState } from "react";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import * as Dialog from "@radix-ui/react-dialog";

export default function MerkleProofGenerator({ whitelist = [], wallet }) {
  const [proof, setProof] = useState(null);

  const generateProof = () => {
    if (!wallet) return;

    const leafNodes = whitelist.map(addr => keccak256(addr.toLowerCase()));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

    const leaf = keccak256(wallet.toLowerCase());
    const proofHex = merkleTree.getHexProof(leaf);

    setProof(proofHex);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Generate Merkle Proof
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Merkle Proof Generator
          </Dialog.Title>

          <div className="space-y-4">
            <button
              onClick={generateProof}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generate Proof for {wallet || "No Wallet Connected"}
            </button>

            {proof && (
              <div className="bg-gray-100 rounded-lg p-3 text-sm break-all max-h-60 overflow-y-auto">
                {JSON.stringify(proof, null, 2)}
              </div>
            )}
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
