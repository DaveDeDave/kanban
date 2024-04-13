import { FC, ReactNode } from "react";
import styles from "./app-structure.module.scss";
import { Outlet } from "react-router-dom";

export interface AppStructureProps {
  header?: ReactNode | null;
  footer?: ReactNode | null;
}

export const AppStructure: FC<AppStructureProps> = ({ header, footer }) => {
  return (
    <div className={styles.appStructure}>
      {header}
      <main className={styles.main}>
        <Outlet />
      </main>
      {footer}
    </div>
  );
};
