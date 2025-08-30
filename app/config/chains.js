export const CHAINS = {
  56: {
    name: "BNB Chain",
    chainId: "0x38",
    network: "binance",
    symbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorer: "https://bscscan.com/",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }
  },
  137: {
    name: "Polygon",
    chainId: "0x89", 
    network: "polygon",
    symbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorer: "https://polygonscan.com/",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 }
  },
  42161: {
    name: "Arbitrum",
    chainId: "0xa4b1",
    network: "arbitrum",
    symbol: "ETH", 
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io/",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
  }
};