import { Maybe, MaybeUndef } from "src/types/UtilityTypes";

import BackgroundOverlay from "src/components/loading/BackgroundOverlay";
import CloseButton from "src/components/buttons/CloseButton";
import ColorClass from "src/types/enums/ColorClass";
import ColorValue from "src/types/enums/ColorValue";
import Header2 from "src/components/text/Header2";
import OutsideClickHideModal from "src/components/modal/OutsideClickHideModal";
import ReactDOM from "react-dom";
import joinClasses from "src/utils/joinClasses";
import styles from "@/css/modal/GenericModal.module.css";
import { useEffect } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  className?: string;
  footer?: MaybeUndef<JSX.Element>;
  hideCloseButton?: boolean;
  hideWithVisibility?: boolean;
  isShown: boolean;
  onHide: () => void;
  title?: string | JSX.Element;
};

export default function GenericModal({
  children,
  className,
  hideCloseButton = false,
  hideWithVisibility = false,
  footer,
  isShown,
  onHide,
  title,
}: Props): Maybe<JSX.Element> {
  // Disable outer scroll when modal is visible.
  // See https://stackoverflow.com/questions/9538868/prevent-body-from-scrolling-when-a-modal-is-opened/69005672#69005672.
  useEffect(() => {
    if (isShown) {
      const width = document.body.clientWidth;
      document.body.style.overflowY = "hidden";
      document.body.style.width = `${width}px`;
    } else {
      document.body.style.overflowY = "scroll";
      document.body.style.width = `auto`;
    }

    return () => {
      document.body.style.overflowY = "scroll";
      document.body.style.width = `auto`;
    };
  }, [isShown]);

  if (!isShown && !hideWithVisibility) {
    return null;
  }

  return (
    <>
      {isShown && <BackgroundOverlay />}
      {ReactDOM.createPortal(
        <div
          className={styles.container}
          style={{
            top: window.scrollY,
            visibility: !isShown && hideWithVisibility ? "hidden" : "visible",
          }}
        >
          <OutsideClickHideModal
            className={styles.outsideClick}
            hideModal={onHide}
          >
            <div className={joinClasses(styles.modal, className)}>
              {title != null && (
                <div className={styles.titleAndClose}>
                  <CloseButton
                    colorValue={ColorValue.Navy}
                    isShown={!hideCloseButton}
                    onClick={onHide}
                  />
                  {typeof title === "string" ? (
                    <Header2 colorClass={ColorClass.Navy} textAlign="center">
                      {title}
                    </Header2>
                  ) : (
                    title
                  )}
                  <CloseButton colorValue={ColorValue.Navy} isShown={false} />
                </div>
              )}
              {children}
              {footer != null && <div className={styles.footer}>{footer}</div>}
            </div>
          </OutsideClickHideModal>
        </div>,
        document.body
      )}
    </>
  );
}
