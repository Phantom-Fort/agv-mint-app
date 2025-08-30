// src/pages/index.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MinterDashboard from "./MinterDashboard";
import KOLDashboard from "./KOLDashboard";

const IndexPage = () => {
  const { walletAddress, isKOL } = useContext(AppContext);

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
      </div>
    );
  }

  return isKOL ? <KOLDashboard /> : <MinterDashboard />;
};

export default IndexPage;
