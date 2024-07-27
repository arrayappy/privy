import styles from "@/css/pages/home/PlayFlipGameGeneric.module.css";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import joinClasses from "src/utils/joinClasses";

type Props = {
  children: any;
  fadeIn?: boolean;
  rowGap: number;
};

export default function PlayFlipGameGeneric({
  children,
  fadeIn = false,
  rowGap,
}: Props) {
  return (
    <ResponsiveContainer>
      <div
        className={joinClasses(styles.container, fadeIn ? styles.fadeIn : null)}
        style={{ rowGap }}
      >
        {children}
      </div>
    </ResponsiveContainer>
  );
}
