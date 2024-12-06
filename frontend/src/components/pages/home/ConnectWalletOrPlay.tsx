import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "src/components/buttons/ConnectWalletButton";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import ButtonTheme from "src/types/enums/ButtonTheme";
import FontClass from "src/types/enums/FontClass";
import styles from "@/css/pages/home/ConnectWalletOrPlay.module.css";
import Image from "next/image";
import useBreakpoint from "src/hooks/useBreakpoint";
import useInitialData from "src/hooks/useInitialData";
import CreateUserForm from "./CreateUserForm";
import BuyTokensCard from "./BuyTokensCard";

export default function ConnectWalletOrPlay() {
  const { publicKey } = useWallet();
  const { isMobileBreakpoint } = useBreakpoint();
  const { isLoading, userExists } = useInitialData();

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
    return <CreateUserForm onSuccess={() => null} />;
  }

  return <BuyTokensCard />;
}
