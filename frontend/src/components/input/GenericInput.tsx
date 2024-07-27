import BodyText from "src/components/text/BodyText";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import HeaderText from "src/components/text/HeaderText";
import styles from "@/css/input/GenericInput.module.css";

type Props = {
  // input element
  children: JSX.Element | Array<JSX.Element | null | boolean>;
  description?: string;
  descriptionFontClass?: FontClass;
  hint?: string;
  hintLengthIndicatorFontClass?: FontClass;
  label?: string | JSX.Element;
  labelFontClass?: FontClass;
  labelTextTransform?: "none" | "uppercase";
  subLabel?: string;
  subLabelFontClass?: FontClass;
};

export default function GenericInput({
  children,
  description,
  descriptionFontClass = FontClass.Body1,
  label,
  labelFontClass = FontClass.Body1,
  labelTextTransform = "none",
  hint,
  hintLengthIndicatorFontClass = FontClass.Body2,
  subLabel,
  subLabelFontClass = FontClass.Body2,
}: Props): JSX.Element {
  return (
    <div>
      {(label != null || subLabel != null) && (
        <div className={styles.labels}>
          {label != null && (
            <BodyText
              className={styles.label}
              fontClass={labelFontClass}
              textTransform={labelTextTransform}
            >
              {label}
            </BodyText>
          )}
          {subLabel != null && (
            <HeaderText
              className={styles.subLabel}
              fontClass={subLabelFontClass}
            >
              {subLabel}
            </HeaderText>
          )}
        </div>
      )}
      {description != null && (
        <BodyText
          className={styles.description}
          fontClass={descriptionFontClass}
        >
          {description}
        </BodyText>
      )}
      {children}
      {hint != null && (
        <BodyText
          className={styles.hint}
          colorClass={ColorClass.Navy}
          fontClass={hintLengthIndicatorFontClass}
        >
          {hint}
        </BodyText>
      )}
    </div>
  );
}
