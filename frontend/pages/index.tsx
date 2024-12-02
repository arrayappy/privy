import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ConnectWalletOrPlay from "src/components/pages/home/ConnectWalletOrPlay";
import styles from "@/css/pages/home/HomePage.module.css";
import PageBody from "src/components/containers/PageBody";
import DelayRender from "src/components/containers/DelayRender";
import { GetServerSideProps } from 'next';

interface HomeProps {
  testData: any; // Replace 'any' with the actual type of your test data
}

const Home: NextPage<HomeProps> = ({ testData }) => {
  return (
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
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Since we're on the server, we need to use absolute URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const response = await fetch(`${protocol}://${host}/api/test-encryption`);
    const testData = await response.json();
    console.log('Test API response:', testData);
    return {
      props: {
        testData,
      },
    };
  } catch (error) {
    console.error('Error fetching test data:', error);
    return {
      props: {
        testData: null,
      },
    };
  }
};

export default Home;
