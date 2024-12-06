import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderDesktop.module.css";
import UpdateUserForm from "src/components/pages/profile/UpdateUserForm";
import withInitialData from "src/components/hoc/withInitialData";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Header />
      <ResponsiveContainer>
        <div className={styles.container}>
          <UpdateUserForm />
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default withInitialData(ProfilePage);
