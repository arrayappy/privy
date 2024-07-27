/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MouseEventHandler, useRef } from "react";

import ButtonName from "src/types/enums/ButtonName";
import ButtonTheme from "src/types/enums/ButtonTheme";
import FontClass from "src/types/enums/FontClass";
import GlobalClass from "src/types/enums/GlobalClass";
import Link from "next/link";
import joinClasses from "src/utils/joinClasses";
import styles from "@/css/buttons/ButtonWithText.module.css";
import useResizeObserver from "@react-hook/resize-observer";

type Props = {
  borderRadius?: number;
  buttonName?: ButtonName;
  buttonTheme: ButtonTheme;
  children: string | JSX.Element | Array<string | JSX.Element>;
  className?: string;
  disabled?: boolean;
  fontClass: FontClass;
  height?: number;
  href?: string;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  logProperties?: { [key: string]: any };
  onClick?: MouseEventHandler;
  style?: { [key: string]: string | number };
  textTransform?: "none" | "uppercase";
  type?: "button" | "link_external" | "link_internal" | "submit";
  width?: "auto" | "100%";
};

function getButtonClassName(
  buttonTheme: ButtonTheme,
  isLink: boolean,
  disabled: boolean
): string {
  switch (buttonTheme) {
    case ButtonTheme.Beige:
      return joinClasses(
        isLink ? styles.beigeThemeLink : styles.beigeTheme,
        disabled ? styles.disabled : null
      );
    case ButtonTheme.WinterGreen:
      return joinClasses(
        isLink ? styles.winterGreenThemeLink : styles.winterGreenTheme,
        disabled ? styles.disabled : null
      );
    case ButtonTheme.Yellow:
      return joinClasses(
        isLink ? styles.yellowThemeLink : styles.yellowTheme,
        disabled ? styles.disabled : null
      );
    default:
      break;
  }

  throw new Error(`unsupported buttonTheme ${buttonTheme}`);
}

function getShadowClassName(
  buttonTheme: ButtonTheme,
  disabled: boolean
): string {
  switch (buttonTheme) {
    case ButtonTheme.Beige:
      return joinClasses(
        styles.beigeShadowTheme,
        disabled ? styles.shadowDisabled : null
      );
    case ButtonTheme.WinterGreen:
      return joinClasses(
        styles.winterGreenShadowTheme,
        disabled ? styles.shadowDisabled : null
      );
    case ButtonTheme.Yellow:
      return joinClasses(
        styles.yellowShadowTheme,
        disabled ? styles.shadowDisabled : null
      );
    default:
      break;
  }

  throw new Error(`unsupported buttonTheme ${buttonTheme}`);
}

export default function ButtonWithText({
  borderRadius,
  buttonName: _buttonName,
  buttonTheme,
  children,
  className,
  disabled = false,
  fontClass,
  height,
  href,
  icon,
  iconPosition = "right",
  logProperties: _logProperties = {},
  onClick,
  style = {},
  textTransform,
  type = "button",
  width = "auto",
}: Props) {
  const styleToUse = {
    ...style,
    borderRadius,
    height,
    ...(textTransform == null ? {} : { textTransform }),
  };
  const classNameJoined = joinClasses(
    getButtonClassName(
      buttonTheme,
      type === "link_internal" || type === "link_external",
      disabled
    ),
    styles.button,
    width === "auto" ? styles.buttonAutoWidth : null,
    fontClass
  );
  const buttonContainerClassName = joinClasses(
    className,
    styles.buttonContainer
  );
  const shadowClassName = joinClasses(
    styles.shadow,
    getShadowClassName(buttonTheme, disabled)
  );

  const buttonRef = useRef(null);
  const shadowRef = useRef(null);
  useResizeObserver(buttonRef, (entry) => {
    // @ts-ignore
    shadowRef.current.style.height = `${entry.borderBoxSize[0].blockSize}px`;
    // @ts-ignore
    shadowRef.current.style.width = `${entry.borderBoxSize[0].inlineSize}px`;
  });
  const shadow = (
    <div className={shadowClassName} ref={shadowRef} style={{ borderRadius }} />
  );

  const childrenWithIcon = (
    <>
      {icon && iconPosition === "left" && (
        <div
          className={joinClasses(
            styles.icon,
            styles.iconLeft,
            GlobalClass.HideText
          )}
        >
          {icon}
        </div>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <div
          className={joinClasses(
            styles.icon,
            styles.iconRight,
            GlobalClass.HideText
          )}
        >
          {icon}
        </div>
      )}
    </>
  );

  const onClickWithLog = (e: any) => {
    // TODO: log?
    if (onClick != null) {
      onClick(e);
    }
  };

  if (type === "link_internal") {
    return (
      <Link href={href ?? ""}>
        <div className={buttonContainerClassName}>
          <div
            className={joinClasses(classNameJoined, styles.linkContent)}
            onClick={onClickWithLog}
            ref={buttonRef}
            style={styleToUse}
          >
            {childrenWithIcon}
          </div>
          {shadow}
        </div>
      </Link>
    );
  }

  if (type === "link_external") {
    return (
      <div className={buttonContainerClassName}>
        <a
          className={joinClasses(classNameJoined, styles.linkContent)}
          href={href ?? ""}
          onClick={onClickWithLog}
          ref={buttonRef}
          style={styleToUse}
        >
          {childrenWithIcon}
        </a>
        {shadow}
      </div>
    );
  }

  return (
    <div className={buttonContainerClassName}>
      <button
        ref={buttonRef}
        className={classNameJoined}
        disabled={disabled}
        onClick={onClickWithLog}
        style={styleToUse}
        // eslint-disable-next-line react/button-has-type
        type={type}
      >
        {childrenWithIcon}
      </button>
      {shadow}
    </div>
  );
}
