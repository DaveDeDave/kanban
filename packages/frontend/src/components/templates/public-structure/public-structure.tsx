import { FC, useContext } from "react";
import { AppStructure } from "../app-structure";
import { Header } from "@/organisms/header";
import { AppContext } from "@/contexts/app.context";
import styles from "./public-structure.module.scss";

export const PublicStructure: FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return "";
  }

  return (
    <AppStructure
      className={styles.publicStructure}
      mainClassname={styles.main}
      header={
        <Header
          navLinks={[
            {
              type: "anchor",
              label: "Home",
              path: "/"
            },
            {
              type: "anchor",
              label: "About",
              path: "/about"
            }
          ]}
        />
      }
    />
  );
};
