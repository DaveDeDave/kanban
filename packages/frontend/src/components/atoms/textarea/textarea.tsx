import { DetailedHTMLProps, FC, TextareaHTMLAttributes, useId } from "react";
import styles from "./textarea.module.scss";
import classNames from "classnames";
import { Text } from "../typography/text";

export interface TextAreaProps
  extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  label?: string;
  error?: string;
  resizable?: boolean;
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  disabled,
  error,
  id: providedId,
  resizable = false,
  ...props
}) => {
  const randomId = useId();

  const id = providedId ?? randomId;

  return (
    <div
      className={classNames(
        styles.textareaWrapper,
        disabled && styles.disabled,
        error && styles.error
      )}
    >
      <div className={classNames(styles.textareaField)}>
        {label ? (
          <label className={classNames(styles.label)} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <textarea
          className={classNames(styles.textarea, resizable && styles.resizable)}
          id={id}
          disabled={disabled}
          {...props}
        />
      </div>
      {error ? (
        <Text type="label" size="sm" className={styles.errorLabel}>
          {error}
        </Text>
      ) : null}
    </div>
  );
};
