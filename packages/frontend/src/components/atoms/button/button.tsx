import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";
import styles from "./button.module.scss";
import { Text } from "../typography/text";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "link";
  rounded?: boolean;
  leftIcon?: ReactNode | null;
  rightIcon?: ReactNode | null;
  iconClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = "primary",
      rounded,
      leftIcon,
      rightIcon,
      className,
      iconClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          rounded && styles.rounded,
          disabled && styles.disabled,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon && (
          <span className={classNames(styles.icon, styles.leftIcon, iconClassName)}>
            {leftIcon}
          </span>
        )}
        {label && <Text type="label">{label}</Text>}
        {rightIcon && (
          <span className={classNames(styles.icon, styles.rightIcon, iconClassName)}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);
