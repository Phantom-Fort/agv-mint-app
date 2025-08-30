import React, { useEffect, useState } from 'react';
import { useAddress } from '@thirdweb-dev/react';
import { useRouter } from 'next/navigation';
import { verifyKOL } from '../utils/verify';
import WalletConnect from '../components/WalletConnect';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const address = useAddress();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isKOL, setIsKOL] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkKOLStatus() {
      if (address) {
        setIsLoading(true);
        try {
          const kolStatus = await verifyKOL(address);
          setIsKOL(kolStatus);
          router.push(kolStatus ? '/kol-dashboard' : '/minter-dashboard');
        } catch (err) {
          setError('Failed to verify KOL status. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }
    checkKOLStatus();
  }, [address, router]);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1>Please connect your wallet</h1>
        <WalletConnect />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Checking KOL status...</h1>
    </div>
  );
}