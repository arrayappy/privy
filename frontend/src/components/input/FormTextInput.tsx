import BodyText from "src/components/text/BodyText";
import FontClass from "src/types/enums/FontClass";
import GenericInput from "src/components/input/GenericInput";
import GlobalClass from "src/types/enums/GlobalClass";
import { UseFormRegisterReturn } from "react-hook-form";
import inputStyles from "@/css/input/InputStyles.module.css";
import joinClasses from "src/utils/joinClasses";
import styles from "@/css/input/TextInput.module.css";

type Props = {
  button?: JSX.Element;
  buttonInner?: JSX.Element;
  className?: string;
  description?: string;
  hasError?: boolean;
  label?: string;
  labelFontClass?: FontClass;
  labelTextTransform?: "none" | "uppercase";
  maxLength?: number;
  maxLengthIndicator?: boolean;
  onChange?: (val: string) => void;
  permaPlaceholder?: string | JSX.Element;
  placeholder?: string;
  registerResult: UseFormRegisterReturn;
  value?: string;
};

export default function FormTextInput({
  button,
  buttonInner,
  className,
  description,
  hasError = false,
  label,
  labelFontClass,
  labelTextTransform = "none",
  maxLength,
  maxLengthIndicator = true,
  permaPlaceholder,
  placeholder = "",
  registerResult,
  value,
}: Props): JSX.Element {
  const hint =
    maxLength != null && maxLengthIndicator
      ? `${maxLength - (value?.length ?? 0)} characters left`
      : undefined;

  return (
    <GenericInput
      description={description}
      hint={hint}
      label={label}
      labelFontClass={labelFontClass}
      labelTextTransform={labelTextTransform}
    >
      <div className={styles.container}>
        {permaPlaceholder && typeof permaPlaceholder === "string" && (
          <BodyText
            className={styles.permaPlaceholder}
            fontClass={FontClass.Body1}
          >
            {permaPlaceholder}
          </BodyText>
        )}
        {permaPlaceholder && typeof permaPlaceholder !== "string" && (
          <div className={styles.permaPlaceholder}>{permaPlaceholder}</div>
        )}
        {buttonInner && (
          <div
            className={joinClasses(styles.buttonInner, GlobalClass.HideText)}
            style={{ right: button == null ? 16 : 48 }}
          >
            {buttonInner}
          </div>
        )}
        <div className={styles.inputContainer}>
          <input
            {...registerResult}
            className={joinClasses(
              inputStyles.textInput,
              FontClass.Body1,
              hasError ? inputStyles.textInputError : null,
              className
            )}
            maxLength={maxLength}
            placeholder={placeholder}
          />
          {button}
        </div>
      </div>
    </GenericInput>
  );
}
