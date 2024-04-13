import { FC } from "react";
import { AppStructure } from "../app-structure";
import { Navbar } from "@/organisms/navbar";
import { Footer } from "@/organisms/footer";

export const PublicStructure: FC = () => {
  return (
    <AppStructure
      header={
        <Navbar
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
      footer={<Footer />}
    />
  );
};
