// app/layout.jsx
import '../styles/globals.css';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { AppProvider } from '@/context/AppContext';
import { client } from '@/lib/thirdweb';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider client={client}>
          <AppProvider>
            {children}
          </AppProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}

