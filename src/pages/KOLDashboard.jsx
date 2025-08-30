// src/pages/KOLDashboard.jsx
import React from "react";
import MinterDashboard from "./MinterDashboard";

const KOLDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">KOL Dashboard</h1>

      {/* Reuse the Minter Dashboard (minting + logs) */}
      <MinterDashboard />

      {/* Extra KOL analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Referrals</h2>
          <p className="text-3xl font-bold">123</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Revenue Generated</h2>
          <p className="text-3xl font-bold">45 ETH</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Leaderboard Rank</h2>
          <p className="text-3xl font-bold">#5</p>
        </div>
      </div>
    </div>
  );
};

export default KOLDashboard;
