import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";
import { Button, ButtonProps } from "../button";
import styles from "./icon-button.module.scss";
import classNames from "classnames";

export type IconButtonProps = Pick<ButtonProps, "variant"> &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    icon?: ReactNode | null;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "primary", icon, className, ...props }, ref) => {
    return (
      <Button
        className={classNames(styles.iconButton, className)}
        iconClassName={styles.icon}
        ref={ref}
        variant={variant}
        leftIcon={icon}
        {...props}
      />
    );
  }
);
