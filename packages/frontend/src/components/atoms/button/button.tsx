import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";
import styles from "./button.module.scss";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label?: string;
  variant: "primary" | "secondary";
  leftIcon?: ReactNode | null;
  icon?: ReactNode | null;
  rightIcon?: ReactNode | null;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, variant, leftIcon, icon, rightIcon, ...props }, ref) => {
    return (
      <button ref={ref} className={classNames(styles.button, styles[variant])} {...props}>
        {leftIcon && <span className={classNames(styles.icon, styles.leftIcon)}>{leftIcon}</span>}
        {icon && <span className={styles.icon}>{icon}</span>}
        {label && <span className={styles.label}>{label}</span>}
        {rightIcon && (
          <span className={classNames(styles.icon, styles.rightIcon)}>{rightIcon}</span>
        )}
      </button>
    );
  }
);
