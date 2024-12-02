import { Connection, PublicKey } from "@solana/web3.js";
import { Context, createContext, useMemo } from "react";
import {
  useWallet,
  WalletProvider as WalletProviderImport,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import PrivyClient from "src/services/solana/PrivyClient";
import { Maybe } from "src/types/UtilityTypes";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// const getRpcUrl = () => "http://127.0.0.1:8899";

const connection = new Connection("https://api.devnet.solana.com", {
  commitment: "confirmed",
});
export type SolanaContextData = {
  connection: Connection;
  privyClient: Maybe<PrivyClient>;
};

export const SolanaContext: Context<SolanaContextData> =
  createContext<SolanaContextData>({
    connection,
    privyClient: null,
  });

type Props = {
  children: any;
};

function Inner({ children }: Props) {
  const wallet = useWallet();
  console.log(wallet.publicKey);
  return (
    <SolanaContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        connection,
        privyClient:
          wallet && wallet.publicKey
            ? new PrivyClient({
                authority: wallet.publicKey,
                connection,
                wallet: {
                  publicKey: wallet.publicKey!,
                  signAllTransactions: wallet.signAllTransactions!,
                  signTransaction: wallet.signTransaction!,
                },
              })
            : null,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
}

export default function SolanaContextProvider({ children }: Props) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new GlowWalletAdapter(),
      new SolflareWalletAdapter(),
      // new BackpackWalletAdapter(),
    ],
    []
  );

  return (
    <WalletProviderImport wallets={wallets} autoConnect>
      <WalletModalProvider>
        <Inner>{children}</Inner>
      </WalletModalProvider>
    </WalletProviderImport>
  );
}

export { default as SolanaContextProvider } from "./SolanaContext";
