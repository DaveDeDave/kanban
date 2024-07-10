import { FC } from "react";
import { AppStructure } from "../app-structure";
import { Sidebar } from "@/organisms/sidebar/sidebar";

export const AuthStructure: FC = () => {
  return (
    <AppStructure
      orientation="horizontal"
      navbar={
        <Sidebar
          navLinks={[
            {
              label: "Home",
              path: "/"
            },
            {
              label: "About",
              path: "/about"
            }
          ]}
        />
      }
    />
  );
};
