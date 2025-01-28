import { DetailedHTMLProps, FC, InputHTMLAttributes, useId } from "react";
import styles from "./input.module.scss";
import classNames from "classnames";
import { Text } from "../typography/text";

export interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: FC<InputProps> = ({ label, disabled, error, id: providedId, ...props }) => {
  const randomId = useId();

  const id = providedId ?? randomId;

  return (
    <div
      className={classNames(
        styles.inputWrapper,
        disabled && styles.disabled,
        error && styles.error
      )}
    >
      <div className={classNames(styles.inputField)}>
        {label ? (
          <label className={classNames(styles.label)} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <input className={styles.input} id={id} disabled={disabled} {...props} />
      </div>
      {error ? (
        <Text type="label" size="sm" className={styles.errorLabel}>
          {error}
        </Text>
      ) : null}
    </div>
  );
};
