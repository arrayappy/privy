import ButtonWithText from "src/components/buttons/ButtonWithText";
import ButtonTheme from "src/types/enums/ButtonTheme";
import FontClass from "src/types/enums/FontClass";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import shortenAddress from "src/utils/solana/shortenAddress";
import { Popover } from "antd";
import TextButton from "src/components/buttons/TextButton";
import TextButtonTheme from "src/types/enums/TextButtonTheme";
import styles from "@/css/buttons/ConnectWalletButton.module.css";

function PopoverContent() {
  const { disconnect } = useWallet();

  return (
    <div className={styles.popover}>
      <TextButton
        buttonTheme={TextButtonTheme.Navy}
        fontClass={FontClass.Header2}
        onClick={disconnect}
        textTransform="uppercase"
      >
        Profile
      </TextButton>
      <TextButton
        buttonTheme={TextButtonTheme.Navy}
        fontClass={FontClass.Header2}
        onClick={disconnect}
        textTransform="uppercase"
      >
        Disconnect wallet
      </TextButton>
    </div>
  );
}

type Props = {
  buttonTheme: ButtonTheme;
  disconnectedLabel?: string;
  fontClass: FontClass;
  width?: number;
};

export default function ConnectWalletButton({
  buttonTheme,
  disconnectedLabel = "Connect Wallet",
  fontClass,
  width,
}: Props) {
  const { setVisible } = useWalletModal();
  const { publicKey } = useWallet();

  if (publicKey == null) {
    return (
      <ButtonWithText
        buttonTheme={buttonTheme}
        fontClass={fontClass}
        onClick={() => setVisible(true)}
        textTransform="uppercase"
        style={width != null ? { width } : undefined}
        width={width != null ? "100%" : undefined}
      >
        {disconnectedLabel}
      </ButtonWithText>
    );
  }

  return (
    <Popover
      placement="bottomRight"
      content={<PopoverContent />}
      trigger="click"
    >
      <ButtonWithText
        buttonTheme={buttonTheme}
        fontClass={fontClass}
        textTransform="uppercase"
        style={width != null ? { width } : undefined}
        width={width != null ? "100%" : undefined}
      >
        {shortenAddress(publicKey.toString())}
      </ButtonWithText>
    </Popover>
  );
}
