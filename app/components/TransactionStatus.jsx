import React from "react";
import { useTransactionHistory } from "../hooks/useTransactionHistory";
import { CHAINS } from "../config/chains";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const TransactionStatus = () => {
  const { transactions } = useTransactionHistory();

  if (transactions.length === 0) return null;

  return (
    <Card className="p-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.slice(0, 5).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  tx.status === "confirmed"
                    ? "bg-green-500"
                    : tx.status === "failed"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              ></div>
              <div>
                <p className="text-sm font-medium">
                  {tx.quantity}x {tx.pass.toUpperCase()} on{" "}
                  {CHAINS[tx.chain]?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">${tx.price}</p>
              <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionStatus;
