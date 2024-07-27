import { Html, Head, Main, NextScript } from "next/document";

const META_DESCRIPTION =
  "Solana's best coin flip app. Double your SOL with just a single coin flip!";
export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous&family=Work+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
