import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import App from './App';
import './styles/globals.css';
import './styles/components.css';
import { CHAINS } from './config/chains';
import { CLIENT_ID } from './config/contracts';

const supportedChains = Object.values(CHAINS).map(chain => ({
  chainId: parseInt(chain.chainId, 16),
  rpc: [chain.rpcUrl],
  nativeCurrency: chain.nativeCurrency,
  slug: chain.network,
  explorer: chain.blockExplorer,
}));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId={CLIENT_ID}
      supportedChains={supportedChains}
      activeChain={supportedChains[0]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
