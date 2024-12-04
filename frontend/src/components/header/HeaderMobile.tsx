import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderMobile.module.css";
import ColorClass from "src/types/enums/ColorClass";
import Body1 from "src/components/text/Body1";
import Link from "next/link";
import HeaderLogo from "src/components/header/HeaderLogo";
import MenuIcon from "src/components/icons/MenuIcon";
import ColorValue from "src/types/enums/ColorValue";
import { Popover } from "antd";
import PlainButton from "src/components/buttons/PlainButton";
import GlobalClass from "src/types/enums/GlobalClass";
import TextButton from "src/components/buttons/TextButton";
import FontClass from "src/types/enums/FontClass";
import { useRouter } from "next/router";
import ConnectWalletButton from "src/components/buttons/ConnectWalletButton";
import ButtonTheme from "src/types/enums/ButtonTheme";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import TwitterIcon from "src/components/icons/TwitterIcon";

function PopoverContent({ onHidePopover }: { onHidePopover: () => void }) {
  const { asPath } = useRouter();
  const { disconnect, publicKey } = useWallet();

  return (
    <div className={styles.popoverContent}>
      {publicKey == null ? (
        <ConnectWalletButton
          buttonTheme={ButtonTheme.Beige}
          fontClass={FontClass.Header2}
        />
      ) : (
        <>
          <TextButton
            fontClass={FontClass.Header2}
            // onClick={() => {
            //   onHidePopover();
            //   // Timeout makes the popover hiding UX smoother. If we don't do it,
            //   // the button will change from "disconnect" to "connect" as the popover is
            //   // fading out.
            //   setTimeout(() => disconnect(), 300);
            // }}
            href="/profile"
            textTransform="uppercase"
            type="link_internal"
          >
            Profile
          </TextButton>
          <TextButton
            fontClass={FontClass.Header2}
            // onClick={() => {
            //   onHidePopover();
            //   // Timeout makes the popover hiding UX smoother. If we don't do it,
            //   // the button will change from "disconnect" to "connect" as the popover is
            //   // fading out.
            //   setTimeout(() => disconnect(), 300);
            // }}
            href="/profile"
            textTransform="uppercase"
            type="link_internal"
          >
            Category Settings
          </TextButton>
          <TextButton
            fontClass={FontClass.Header2}
            onClick={() => {
              onHidePopover();
              // Timeout makes the popover hiding UX smoother. If we don't do it,
              // the button will change from "disconnect" to "connect" as the popover is
              // fading out.
              setTimeout(() => disconnect(), 300);
            }}
            textTransform="uppercase"
          >
            Disconnect wallet
          </TextButton>
        </>
      )}
      <TextButton
        fontClass={FontClass.Header2}
        href="/info"
        textDecoration={asPath === "/info" ? "underline" : undefined}
        textTransform="uppercase"
        type="link_internal"
      >
        Info
      </TextButton>
      <TextButton
        fontClass={FontClass.Header2}
        href="/fruits"
        textDecoration={asPath === "/fruits" ? "underline" : undefined}
        textTransform="uppercase"
        type="link_internal"
      >
        Stats
      </TextButton>
      <TextButton
        fontClass={FontClass.Header2}
        href="https://twitter.com/arrayappy"
        icon={<TwitterIcon colorValue={ColorValue.Navy} />}
        target="_blank"
        textTransform="uppercase"
        type="link_external"
      >
        Twitter
      </TextButton>
    </div>
  );
}

export default function HeaderMobile() {
  const [visible, setVisible] = useState(false);

  return (
    <ResponsiveContainer className={styles.container}>
      <div className={styles.row1}>
        <div className={styles.left}>
          <Popover
            placement="bottomLeft"
            content={<PopoverContent onHidePopover={() => setVisible(false)} />}
            trigger="click"
            visible={visible}
            onVisibleChange={setVisible}
          >
            <PlainButton className={GlobalClass.HideText}>
              <MenuIcon colorValue={ColorValue.Navy} />
            </PlainButton>
          </Popover>
        </div>
        <div className={styles.center}>
          <Link href="/">
            {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <HeaderLogo />
            </a>
          </Link>
        </div>
        <div className={styles.right}>
          <MenuIcon colorValue={ColorValue.Navy} />
        </div>
      </div>
      <div className={styles.row2}>
        <Body1 colorClass={ColorClass.Navy} textAlign="center">
          A secure channel to receive private messages.
        </Body1>
      </div>
    </ResponsiveContainer>
  );
}
