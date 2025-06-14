import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";
import styles from "./button.module.scss";
import { Text } from "../typography/text";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "link";
  destructive?: boolean;
  rounded?: boolean;
  fitContent?: boolean;
  leftIcon?: ReactNode | null;
  rightIcon?: ReactNode | null;
  iconClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = "primary",
      destructive,
      rounded,
      fitContent,
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
          destructive && styles.destructive,
          rounded && styles.rounded,
          fitContent && styles.fitContent,
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
