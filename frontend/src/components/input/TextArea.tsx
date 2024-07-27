import FontClass from "src/types/enums/FontClass";
import GenericInput from "src/components/input/GenericInput";
import inputStyles from "@/css/input/InputStyles.module.css";
import joinClasses from "src/utils/joinClasses";

type Props = {
  button?: JSX.Element;
  className?: string;
  label?: string;
  labelFontClass?: FontClass;
  labelTextTransform?: "none" | "uppercase";
  maxLength?: number;
  rows?: number;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
};

export default function TextArea({
  button,
  className,
  label,
  labelFontClass,
  labelTextTransform = "none",
  maxLength,
  onChange,
  placeholder,
  rows = 2,
  value,
}: Props): JSX.Element {
  const hint =
    maxLength != null
      ? `${maxLength - (value?.length ?? 0)} characters left`
      : undefined;

  return (
    <GenericInput
      hint={hint}
      label={label}
      labelFontClass={labelFontClass}
      labelTextTransform={labelTextTransform}
    >
      <div className={inputStyles.textAreaContainerOuter}>
        {/* Need this extra div to apply border radius to scrollbar */}
        <div className={inputStyles.textAreaContainer}>
          <textarea
            className={joinClasses(
              inputStyles.textArea,
              className,
              FontClass.Body1
            )}
            maxLength={maxLength}
            onChange={(e) => {
              const val = e.target.value;
              if (maxLength != null && val.length > maxLength) {
                return;
              }

              onChange(val);
            }}
            placeholder={placeholder}
            rows={rows}
            value={value}
          />
        </div>
        {button}
      </div>
    </GenericInput>
  );
}
