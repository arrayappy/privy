import { ReactNode } from 'react';
import { SolanaContextProvider } from 'src/context/SolanaContext';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PlayFlipGameContextProvider } from 'src/context/PlayFlipGameContext';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <WalletProvider wallets={[]} autoConnect>
      <SolanaContextProvider>
        <PlayFlipGameContextProvider>
          {children}
        </PlayFlipGameContextProvider>
      </SolanaContextProvider>
    </WalletProvider>
  );
} 