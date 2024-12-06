import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderDesktop.module.css";
import CategorySettingsForm from "src/components/pages/categories/CategorySettingsForm";
import withInitialData from "src/components/hoc/withInitialData";

const CategoriesPage: NextPage = () => {
  return (
    <>
      <Header />
      <ResponsiveContainer>
        <div className={styles.container}>
          <CategorySettingsForm />
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default withInitialData(CategoriesPage); 