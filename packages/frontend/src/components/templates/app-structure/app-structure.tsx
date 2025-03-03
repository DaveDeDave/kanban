import { FC, ReactNode } from "react";
import styles from "./app-structure.module.scss";
import classNames from "classnames";
import { Outlet } from "@tanstack/react-router";

export interface AppStructureProps {
  header?: ReactNode | null;
  navbar?: ReactNode | null;
  footer?: ReactNode | null;
  orientation?: "vertical" | "horizontal";
  className?: string;
  mainClassname?: string;
}

export const AppStructure: FC<AppStructureProps> = ({
  header,
  navbar,
  footer,
  orientation = "vertical",
  className,
  mainClassname
}) => {
  return (
    <div className={classNames(styles.appStructure, styles[orientation], className)}>
      {header}
      {navbar}
      <main className={classNames(styles.main, mainClassname)}>
        <Outlet />
      </main>
      {footer}
    </div>
  );
};
