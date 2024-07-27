import type { NextPage } from "next";
import Header from "src/components/header/Header";
import InfoPage from "src/components/pages/info/InfoPage";

// eslint-disable-next-line react/function-component-definition
const Info: NextPage = () => (
  <>
    <Header />
    <InfoPage />
  </>
);

export default Info;
