import "antd/dist/antd.css";
import "@/css/global/Antd.css";
import "@/css/global/Global.css";

// Colors
import "@/css/global/colors/ColorVariables.css";
import "@/css/global/colors/BackgroundColorClasses.css";
import "@/css/global/colors/ColorClasses.css";

// Fonts
import "@/css/global/fonts/FontClasses.css";
import "@/css/global/fonts/FontVariables.css";

// Shadows
import "@/css/global/shadows/ShadowVariables.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SolanaContextProvider from "src/context/SolanaContext";

// Necessary to put down here so that these styles take precedence
import "@/css/global/Wallet.css";
import { PlayFlipGameContextProvider } from "src/context/PlayFlipGameContext";

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Privy - A Secure Feedback Receiving App</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SolanaContextProvider>
          <PlayFlipGameContextProvider>
            <Component {...pageProps} />
          </PlayFlipGameContextProvider>
        </SolanaContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
