import React from "react";
import { useApp } from "../context/AppContext";
import { useWallet } from "../hooks/useWallet";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ chain, id, special }) => {
  const { state } = useApp();
  const { isConnected, wallet } = useWallet();

  if (special) {
    return <Badge variant="outline">{special}</Badge>;
  }

  const isSelected = Number(id) === state.selectedChain;
  const isConnectedToChain = isConnected && wallet?.chainId === Number(id);

  const getVariant = () => {
    if (isConnectedToChain) return "success";
    if (isSelected) return "blue";
    return "secondary";
  };

  return (
    <Badge variant={getVariant()}>
      {isConnectedToChain ? "🟢" : isSelected ? "🔵" : "⚪"} {chain} ({id})
      {isConnectedToChain && <span className="ml-1">Connected</span>}
      {isSelected && !isConnectedToChain && <span className="ml-1">Selected</span>}
    </Badge>
  );
};

export default StatusBadge;
