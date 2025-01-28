import { FC, useContext } from "react";
import { AppStructure } from "../app-structure";
import { Header } from "@/organisms/header";
import { Footer } from "@/organisms/footer";
import { AppContext } from "@/contexts/app.context";

export const PublicStructure: FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return "";
  }

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
