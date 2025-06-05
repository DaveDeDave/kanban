import { FC } from "react";
import styles from "./divider.module.scss";
import classNames from "classnames";

export interface DividerProps {
  variant?: "dark" | "light";
}

export const Divider: FC<DividerProps> = ({ variant = "dark" }) => {
  return <div className={classNames(styles.divider, styles[variant])} />;
};
