/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ButtonName from "src/types/enums/ButtonName";
import FontClass from "src/types/enums/FontClass";
import GlobalClass from "src/types/enums/GlobalClass";
import Link from "next/link";
import { MouseEventHandler } from "react";
import TextButtonTheme from "src/types/enums/TextButtonTheme";
import joinClasses from "src/utils/joinClasses";
import styles from "@/css/buttons/TextButton.module.css";

const THEME_TO_CLASS_NAME = {
  [TextButtonTheme.Navy]: styles.buttonNavy,
};

const THEME_TO_ACTIVE_CLASS_NAME = {
  [TextButtonTheme.Navy]: styles.buttonNavyActive,
};

type Props = {
  buttonName?: ButtonName;
  buttonTheme?: keyof typeof THEME_TO_CLASS_NAME;
  children: string | Array<string> | JSX.Element;
  className?: string;
  display?: "block" | "flex" | "inline";
  fontClass?: FontClass;
  href?: string;
  icon?: JSX.Element;
  isActive?: boolean;
  logProperties?: { [key: string]: any };
  onClick?: MouseEventHandler;
  target?: "_blank";
  textDecoration?: "none" | "underline";
  textTransform?: "none" | "uppercase";
  type?: "button" | "link_external" | "link_internal" | "submit";
};

export default function TextButton({
  buttonName: _buttonName,
  buttonTheme = TextButtonTheme.Navy,
  children,
  className,
  display = "flex",
  fontClass,
  href,
  icon,
  isActive = false,
  logProperties: _logProperties,
  onClick,
  target,
  textDecoration,
  textTransform,
  type = "button",
}: Props): JSX.Element {
  const classNameJoined = joinClasses(
    styles.button,
    className,
    THEME_TO_CLASS_NAME[buttonTheme],
    isActive ? THEME_TO_ACTIVE_CLASS_NAME[buttonTheme] : null,
    fontClass
  );
  const style = {
    display,
    ...(textTransform == null ? {} : { textTransform }),
    ...(textDecoration == null ? {} : { textDecoration }),
  };

  const childrenWithIcon = (
    <>
      {icon != null && (
        <div
          className={joinClasses(styles.iconContainer, GlobalClass.HideText)}
        >
          {icon}
        </div>
      )}
      {children}
    </>
  );

  const onClickWithLog: MouseEventHandler = (e) => {
    // TODO: add logging?
    if (onClick != null) {
      onClick(e);
    }
  };

  if (type === "link_internal") {
    return (
      <Link href={href ?? ""}>
        <div className={classNameJoined} onClick={onClickWithLog} style={style}>
          {childrenWithIcon}
        </div>
      </Link>
    );
  }

  if (type === "link_external") {
    return (
      <a
        className={classNameJoined}
        href={href ?? ""}
        onClick={onClickWithLog}
        style={style}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
      >
        {childrenWithIcon}
      </a>
    );
  }

  return (
    <button
      className={classNameJoined}
      onClick={onClickWithLog}
      style={style}
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {childrenWithIcon}
    </button>
  );
}
