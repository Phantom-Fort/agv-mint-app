import React from 'react';
import { useApp } from '../context/AppContext';
import { PASS_PRICES } from '../config/pricing';

const QuantityInput = () => {
  const { state, dispatch } = useApp();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(1, Math.min(5, value));
    dispatch({ type: 'SET_QUANTITY', payload: clampedValue });
  };

  const incrementQuantity = () => {
    if (state.quantity < 5) {
      dispatch({ type: 'SET_QUANTITY', payload: state.quantity + 1 });
    }
  };

  const decrementQuantity = () => {
    if (state.quantity > 1) {
      dispatch({ type: 'SET_QUANTITY', payload: state.quantity - 1 });
    }
  };

  const totalPrice = (PASS_PRICES[state.selectedPass]?.usd || 0) * state.quantity;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Quantity (Max: 5)
      </label>
      
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={decrementQuantity}
          disabled={state.quantity <= 1}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <input
          type="number"
          min="1"
          max="5"
          value={state.quantity}
          onChange={handleQuantityChange}
          className="input-field text-center w-20"
        />
        
        <button
          type="button"
          onClick={incrementQuantity}
          disabled={state.quantity >= 5}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {/* Price Summary */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-medium">${PASS_PRICES[state.selectedPass]?.usd || 0}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium">{state.quantity}</span>
        </div>
        <hr className="my-2 border-gray-200" />
        <div className="flex justify-between items-center font-bold text-blue-600">
          <span>Total:</span>
          <span>${totalPrice}</span>
        </div>
      </div>
      
      {/* Quantity Info */}
      <div className="text-xs text-gray-500">
        Maximum 5 NFTs per transaction
      </div>
    </div>
  );
};

export default QuantityInput;