// src/pages/MinterDashboard.jsx
import React from "react";
import WalletConnect from "../components/WalletConnect";
import ChainSelector from "../components/ChainSelector";
import PassSelector from "../components/PassSelector";
import QuantityInput from "../components/QuantityInput";
import MintButton from "../components/MintButton";
import TransactionStatus from "../components/TransactionStatus";
import ActivityLog from "../components/ActivityLog";
import MerkleProofGenerator from "../components/MerkleProofGenerator";
import { useApp } from "../context/AppContext";

const MinterDashboard = () => {
  const { state } = useApp();
  const { wallet, whitelist, loading, error } = state;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Minter Dashboard</h1>

      {/* Notice Section */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-yellow-800">
          Minting is only supported on <strong>BNB</strong>,{" "}
          <strong>Arbitrum</strong>, and <strong>Polygon</strong>. <br />
          Payment is accepted exclusively in <strong>USDT</strong>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mint Section */}
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <WalletConnect />
          <ChainSelector />
          <PassSelector />
          <QuantityInput />
          <MintButton />
          <TransactionStatus />

          {/* Merkle Proof Generator using context whitelist */}
          {loading ? (
            <p className="text-gray-500 text-sm">Loading whitelist...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            <MerkleProofGenerator whitelist={whitelist} wallet={wallet} />
          )}
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">My Activity</h2>
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default MinterDashboard;
