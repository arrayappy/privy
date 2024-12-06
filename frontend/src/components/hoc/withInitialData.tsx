import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import useInitialData from 'src/hooks/useInitialData';
import ConnectWalletOrPlay from '../pages/home/ConnectWalletOrPlay';
import { useEffect } from 'react';

export default function withInitialData<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithInitialDataComponent(props: P) {
    const { connected } = useWallet();
    const router = useRouter();
    const { isLoading, userExists } = useInitialData();

    useEffect(() => {
      console.log(connected, userExists, router.pathname);
      // if (!connected && router.pathname !== '/') {
      //   router.push('/');
      // } else 
      if (userExists === false && router.pathname !== '/') {
        router.push('/');
      }
    }, [connected, userExists, router.pathname]);

    // During server-side rendering or initial mount, show loading
    if (typeof window === 'undefined') {
      return null;
    }

    if (!connected) {
      // Only show ConnectWalletOrPlay on home page
      if (router.pathname === '/') {
        return <ConnectWalletOrPlay />;
      }
      return null; // Will redirect in useEffect
    }

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      );
    }

    if (userExists === false) {
      // Only show ConnectWalletOrPlay on home page
      if (router.pathname === '/') {
        return <ConnectWalletOrPlay />;
      }
      return null; // Will redirect in useEffect
    }

    return <WrappedComponent {...props} />;
  };
} 