import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderDesktop.module.css";
import ColorClass from "src/types/enums/ColorClass";
import TextButton from "src/components/buttons/TextButton";
import FontClass from "src/types/enums/FontClass";
import ConnectWalletButton from "src/components/buttons/ConnectWalletButton";
import ButtonTheme from "src/types/enums/ButtonTheme";
import DelayRender from "src/components/containers/DelayRender";
import Body1 from "src/components/text/Body1";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderLogo from "src/components/header/HeaderLogo";
import useBreakpoint from "src/hooks/useBreakpoint";
import ExternalLink from "src/components/links/ExternalLink";
import TwitterIcon from "src/components/icons/TwitterIcon";
import ColorValue from "src/types/enums/ColorValue";
import GlobalClass from "src/types/enums/GlobalClass";

function LeftButtons() {
  const { asPath } = useRouter();

  return (
    <div className={styles.left}>
      <ExternalLink
        className={GlobalClass.HideText}
        href="https://twitter.com/arrayappy"
      >
        <TwitterIcon colorValue={ColorValue.Navy} />
      </ExternalLink>
      <TextButton
        fontClass={FontClass.Header2}
        href="/fruits"
        textDecoration={asPath === "/fruits" ? "underline" : undefined}
        textTransform="uppercase"
        type="link_internal"
      >
        Fruits
      </TextButton>
      <TextButton
        fontClass={FontClass.Header2}
        href="/info"
        textDecoration={asPath === "/info" ? "underline" : undefined}
        textTransform="uppercase"
        type="link_internal"
      >
        Info
      </TextButton>
    </div>
  );
}

export default function HeaderDesktop() {
  const { isTabletExtraWideBreakpoint } = useBreakpoint();

  return (
    <ResponsiveContainer className={styles.container}>
      <div className={styles.row1}>
        <LeftButtons />
        <div className={styles.center}>
          <Link href="/">
            {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <HeaderLogo />
            </a>
          </Link>
        </div>
        <div className={styles.right}>
          <DelayRender>
            <ConnectWalletButton
              buttonTheme={ButtonTheme.Beige}
              disconnectedLabel={
                isTabletExtraWideBreakpoint ? "Connect" : undefined
              }
              fontClass={FontClass.Header2}
            />
          </DelayRender>
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
