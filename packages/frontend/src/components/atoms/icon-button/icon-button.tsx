import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";
import { Button, ButtonProps } from "../button";
import styles from "./icon-button.module.scss";

export type IconButtonProps = Pick<ButtonProps, "variant"> &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    icon?: ReactNode | null;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, icon }, ref) => {
    return (
      <Button
        className={styles.iconButton}
        iconClassName={styles.icon}
        ref={ref}
        variant={variant}
        leftIcon={icon}
      />
    );
  }
);
