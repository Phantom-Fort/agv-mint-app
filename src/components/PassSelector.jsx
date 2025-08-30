import React from 'react';
import { useApp } from '../context/AppContext';
import { useContractValidation } from '../hooks/useContractValidation';
import { PASS_DETAILS, PASS_PRICES } from '../config/pricing';

const PassSelector = () => {
  const { state, dispatch } = useApp();
  const validation = useContractValidation();

  const handlePassChange = (e) => {
    dispatch({ type: 'SET_PASS', payload: e.target.value });
  };

  const getPassStatus = (passType) => {
    const contractAddress = validation.contractAddress;
    if (state.selectedPass === passType) {
      if (!contractAddress || contractAddress === "0x...") {
        return 'unavailable';
      }
      return 'available';
    }
    return 'default';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Pass Type
      </label>
      
      <div className="relative">
        <select 
          value={state.selectedPass}
          onChange={handlePassChange}
          className="input-field appearance-none pr-10"
        >
          {Object.entries(PASS_DETAILS).map(([passKey, passInfo]) => {
            const price = PASS_PRICES[passKey];
            return (
              <option key={passKey} value={passKey}>
                {passInfo.name} (${price?.usd || 'N/A'})
              </option>
            );
          })}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

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
        
        {/* Availability Status */}
        <div className="flex items-center space-x-2">
          {getPassStatus(state.selectedPass) === 'available' && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Available on this chain</span>
            </>
          )}
          
          {getPassStatus(state.selectedPass) === 'unavailable' && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-600">Not available on this chain</span>
            </>
          )}
        </div>
      </div>
      
      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <div className="text-xs text-red-600 space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index}>⚠️ {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassSelector;