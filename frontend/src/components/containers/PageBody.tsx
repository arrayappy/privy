import styles from "@/css/containers/PageBody.module.css";

type Props = {
  children: any;
};

export default function PageBody({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}
