import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ConnectWalletOrPlay from "src/components/pages/home/ConnectWalletOrPlay";
import styles from "@/css/pages/home/HomePage.module.css";
import PageBody from "src/components/containers/PageBody";
import DelayRender from "src/components/containers/DelayRender";

// eslint-disable-next-line react/function-component-definition
const Home: NextPage = () => (
  <>
    <Header />
    <DelayRender>
      <PageBody>
        <div className={styles.body}>
          <ConnectWalletOrPlay />
        </div>
      </PageBody>
    </DelayRender>
  </>
);

export default Home;
