import { RefObject, useRef } from "react";

import useOutsideClickHideModal from "src/hooks/useOutsideClickHideModal";

const EMPTY_ARRAY: Array<RefObject<HTMLElement>> = [];

/**
 * Component that hides a modal (should be itself) if you click outside of it.
 *
 * Also hides it if "escape" is pressed.
 */
export default function OutsideClickHideModal(props: {
  children: any;
  className?: string;
  excludeRefs?: Array<RefObject<HTMLElement>>;
  hideModal: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClickHideModal(
    wrapperRef,
    props.excludeRefs ?? EMPTY_ARRAY,
    props.hideModal
  );

  return (
    // position: static causes a bug when the viewer dropdown is expanded. Basically
    // this div acts like a flex item and moves the other flex items around.
    <div
      className={props.className}
      ref={wrapperRef}
      style={{ position: "absolute" }}
    >
      {props.children}
    </div>
  );
}
