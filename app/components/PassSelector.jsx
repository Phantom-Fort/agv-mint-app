// src/components/PassSelector.jsx
import React from "react";
import * as Select from "@radix-ui/react-select";
import { useApp } from "../context/AppContext";
import { useContractValidation } from "../hooks/useContractValidation";
import { PASS_DETAILS, PASS_PRICES } from "../config/pricing";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const PassSelector = () => {
  const { state, dispatch } = useApp();
  const validation = useContractValidation();

  const handlePassChange = (passType) => {
    dispatch({ type: "SET_PASS", payload: passType });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Pass Type
      </label>

      <Select.Root
        value={state.selectedPass}
        onValueChange={handlePassChange}
      >
        <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm focus:outline-none">
          <Select.Value placeholder="Select a pass" />
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
              {Object.entries(PASS_DETAILS).map(([passKey, passInfo]) => {
                const price = PASS_PRICES[passKey];
                return (
                  <Select.Item
                    key={passKey}
                    value={passKey}
                    className="flex items-center px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-gray-100"
                  >
                    <Select.ItemText>
                      {passInfo.name} (${price?.usd || "N/A"})
                    </Select.ItemText>
                    <Select.ItemIndicator className="ml-auto">
                      <CheckIcon className="w-4 h-4 text-blue-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-50">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Pass Details */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-900">
            {PASS_DETAILS[state.selectedPass]?.name}
          </h4>
          <span className="text-lg font-bold text-blue-600">
            ${PASS_PRICES[state.selectedPass]?.usd}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {PASS_DETAILS[state.selectedPass]?.description}
        </p>
      </div>

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <div className="text-xs text-red-600 space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index}><img
                    src="https://img.icons8.com/?size=100&id=360&format=png&color=000000"
                    alt="error icon"
                  /> {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassSelector;
