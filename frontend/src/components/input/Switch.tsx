import styles from "/css/input/Switch.module.css";
import joinClasses from "src/utils/joinClasses";

type Props = {
  checked: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
};

export default function Switch({ checked, className, onChange }: Props) {
  return (
    <label className={joinClasses(styles.switch, className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.slider} />
    </label>
  );
} 