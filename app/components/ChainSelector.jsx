// src/components/ChainSelector.jsx
import React from "react";
import * as Select from "@radix-ui/react-select";
import { useApp } from "../context/AppContext";
import { useChainSwitch } from "../hooks/useChainSwitch";
import { useWallet } from "../hooks/useWallet";
import { CHAINS } from "../config/chains";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const ChainSelector = () => {
  const { state, dispatch } = useApp();
  const { switchToChain, isSwitching } = useChainSwitch();
  const { isConnected } = useWallet();

  const handleChainChange = async (chainId) => {
    const newChainId = Number(chainId);
    dispatch({ type: "SET_CHAIN", payload: newChainId });

    if (isConnected) {
      try {
        await switchToChain(newChainId);
      } catch (error) {
        console.error("Chain switch failed:", error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Blockchain Network
      </label>

      <Select.Root
        value={String(state.selectedChain)}
        onValueChange={handleChainChange}
        disabled={isSwitching}
      >
        <Select.Trigger
          className="inline-flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm focus:outline-none disabled:opacity-50"
          aria-label="Blockchain Network"
        >
          <Select.Value placeholder="Select a chain" />
          <Select.Icon>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-50">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              {Object.entries(CHAINS).map(([chainId, chain]) => (
                <Select.Item
                  key={chainId}
                  value={chainId}
                  className="flex items-center px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-gray-100"
                >
                  <Select.ItemText>
                    {chain.name} ({chain.symbol})
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-50">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {isSwitching && (
        <div className="flex items-center space-x-2 text-blue-600 text-sm">
          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Switching network...</span>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Selected: {CHAINS[state.selectedChain]?.name}
      </div>
    </div>
  );
};

export default ChainSelector;
