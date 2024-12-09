import { Connection, PublicKey } from "@solana/web3.js";
import { Context, createContext, useMemo, useState } from "react";
import {
  useWallet,
  WalletProvider as WalletProviderImport,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// import PrivySdk from "src/services/solana/PrivyClient";
import { Maybe } from "src/types/UtilityTypes";
// import PrivyClient from "src/services/solana/PrivyClient";
import { PrivySdk } from "@privy/sdk/program";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const connection = new Connection("https://api.devnet.solana.com", {
  commitment: "confirmed",
});
type PrivyUser = {
  username: string;
  tokenLimit: number;
  categories: string;
  messages: string[];
  bump: number;
};

type Category = {
  cat_name: string;
  passkey: string;
  enabled: boolean;
  single_msg: boolean;
};

type DbUser = {
  user_addr: string;
  user_name: string;
  password_salt: string;
  password_pubkey: string;
  created_at: string;
  updated_at: string;
};

export type SolanaContextData = {
  connection: Connection;
  privyClient: Maybe<PrivySdk>;
  privyUser: Maybe<PrivyUser>;
  setPrivyUser: (user: Maybe<PrivyUser>) => void;
  dbUser: Maybe<DbUser>;
  setDbUser: (user: Maybe<DbUser>) => void;
  decryptedCategories: Maybe<Category[]>;
  setDecryptedCategories: (categories: Maybe<Category[]>) => void;
};

export const SolanaContext: Context<SolanaContextData> =
  createContext<SolanaContextData>({
    connection,
    privyClient: null,
    privyUser: null,
    setPrivyUser: () => {},
    dbUser: null,
    setDbUser: () => {},
    decryptedCategories: null,
    setDecryptedCategories: () => {},
  });

type Props = {
  children: any;
};

function Inner({ children }: Props) {
  const wallet = useWallet();
  const [privyUser, setPrivyUser] = useState<Maybe<PrivyUser>>(null);
  const [decryptedCategories, setDecryptedCategories] =
    useState<Maybe<Category[]>>(null);
  const [dbUser, setDbUser] = useState<Maybe<DbUser>>(null);
  return (
    <SolanaContext.Provider
      value={{
        connection,
        privyClient:
          wallet && wallet.publicKey
            ? new PrivySdk({
                authority: wallet.publicKey,
                connection,
                wallet: {
                  publicKey: wallet.publicKey!,
                  signAllTransactions: wallet.signAllTransactions!,
                  signTransaction: wallet.signTransaction!,
                },
              })
            : null,
        privyUser,
        setPrivyUser,
        decryptedCategories,
        setDecryptedCategories,
        dbUser,
        setDbUser,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
}

export default function SolanaContextProvider({ children }: Props) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ autoConnect: true }),
      new SolflareWalletAdapter(),
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
