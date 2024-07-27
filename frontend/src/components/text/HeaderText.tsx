import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import joinClasses from "src/utils/joinClasses";
import styles from "@/css/text/HeaderText.module.css";

export type Props = {
  children:
    | string
    | JSX.Element
    | Array<JSX.Element | string | number>
    | number;
  className?: string;
  colorClass?: ColorClass;
  fontClass: FontClass;
  textAlign?: "center" | "left" | "right";
  textTransform?: "none" | "uppercase";
};

export default function HeaderText({
  children,
  className,
  colorClass,
  fontClass,
  textAlign,
  textTransform,
}: Props): JSX.Element {
  const classNameJoined = joinClasses(
    fontClass,
    styles.header,
    className,
    colorClass
  );

  const style = {
    ...(textAlign != null ? { textAlign } : {}),
    ...(textTransform != null ? { textTransform } : {}),
  };

  switch (fontClass) {
    case FontClass.Header0:
    case FontClass.Header1:
      return (
        <h1 className={classNameJoined} style={style}>
          {children}
        </h1>
      );
    case FontClass.Header2:
      return (
        <h2 className={classNameJoined} style={style}>
          {children}
        </h2>
      );
    default:
      throw new Error(`Unexpected fontClass of ${fontClass}`);
  }
}
