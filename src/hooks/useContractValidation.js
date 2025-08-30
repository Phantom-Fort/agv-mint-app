import { useEffect, useState } from 'react';
import { NFT_CONTRACTS, USDT_ADDRESSES } from '../config/contracts';
import { PASS_PRICES } from '../config/pricing';
import { useApp } from '../context/AppContext';

export function useContractValidation() {
  const { state } = useApp();
  const [validation, setValidation] = useState({
    isValid: false,
    contractAddress: null,
    usdtAddress: null,
    price: null,
    errors: []
  });

  useEffect(() => {
    const { selectedChain, selectedPass, quantity } = state;
    const errors = [];

    // Validate contract address
    const contractAddress = NFT_CONTRACTS[selectedPass]?.[selectedChain];
    if (!contractAddress || contractAddress === "0x...") {
      errors.push(`${selectedPass} pass not available on chain ${selectedChain}`);
    }

    // Validate USDT address
    const usdtAddress = USDT_ADDRESSES[selectedChain];
    if (!usdtAddress) {
      errors.push(`USDT not supported on chain ${selectedChain}`);
    }

    // Validate price
    const price = PASS_PRICES[selectedPass];
    if (!price) {
      errors.push(`Invalid pass type: ${selectedPass}`);
    }

    // Validate quantity
    if (quantity < 1 || quantity > 5) {
      errors.push('Quantity must be between 1 and 5');
    }

    setValidation({
      isValid: errors.length === 0,
      contractAddress,
      usdtAddress,
      price,
      errors
    });
  }, [state]);

  return validation;
}