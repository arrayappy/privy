import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import useInitialData from 'src/hooks/useInitialData';
import ConnectWalletOrPlay from '../pages/home/ConnectWalletOrPlay';
import { useEffect } from 'react';
import Body1 from '../text/Body1';
import HeaderLogo from '../header/HeaderLogo';
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <HeaderLogo />
          <Body1 textAlign='center'>Loading...</Body1>
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