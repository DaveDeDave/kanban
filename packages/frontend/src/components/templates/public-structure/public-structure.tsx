import { FC } from "react";
import { AppStructure } from "../app-structure";
import { Header } from "@/organisms/header";
import { Footer } from "@/organisms/footer";

export const PublicStructure: FC = () => {
  return (
    <AppStructure
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
      footer={<Footer />}
    />
  );
};
