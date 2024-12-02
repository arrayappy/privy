import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import ConnectWalletButton from "src/components/buttons/ConnectWalletButton";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import ButtonTheme from "src/types/enums/ButtonTheme";
import FontClass from "src/types/enums/FontClass";
import styles from "@/css/pages/home/ConnectWalletOrPlay.module.css";
import Image from "next/image";
import useBreakpoint from "src/hooks/useBreakpoint";
import useSolanaContext from "src/hooks/useSolanaContext";
import CreateUserForm from "./CreateUserForm";
import BuyTokensCard from "./BuyTokensCard";

export default function ConnectWalletOrPlay() {
  const { publicKey } = useWallet();
  const { isMobileBreakpoint } = useBreakpoint();
  const { privyClient } = useSolanaContext();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      if (!publicKey || !privyClient) {
        setIsLoading(false);
        return;
      }

      try {
        const [privyUserPDA] = await PublicKey.findProgramAddressSync(
          [Buffer.from("privy-user"), publicKey.toBuffer()],
          privyClient.program.programId
        );
        const accountInfo = await privyClient.program.provider.connection.getAccountInfo(privyUserPDA);
        console.log("accountInfo", accountInfo?.data.toString());
        setUserExists(accountInfo !== null);
      } catch (error) {
        console.error("Error checking user:", error);
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkUser();
  }, [publicKey, privyClient]);

  if (publicKey == null) {
    return (
      <ResponsiveContainer>
        <div className={styles.container}>
          <Image height={500} priority src="/images/icon.png" width={500} />
          <ConnectWalletButton
            buttonTheme={ButtonTheme.WinterGreen}
            fontClass={FontClass.Header1}
            width={isMobileBreakpoint ? 320 : 380}
          />
        </div>
      </ResponsiveContainer>
    );
  }

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <div className={styles.container}>
          <div>Loading...</div>
        </div>
      </ResponsiveContainer>
    );
  }

  if (!userExists) {
    return <CreateUserForm onSuccess={() => setUserExists(true)} />;
  }

  return <BuyTokensCard />;
}
