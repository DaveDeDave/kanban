import { FC } from "react";
import { AppStructure } from "../app-structure";
import { Sidebar } from "@/organisms/sidebar/sidebar";
import {
  RiHomeFill,
  RiHomeLine,
  RiLogoutBoxLine,
  RiSettingsFill,
  RiSettingsLine
} from "@remixicon/react";
import { useNavigate } from "@tanstack/react-router";

export const AuthStructure: FC = () => {
  const navigate = useNavigate();

  return (
    <AppStructure
      orientation="horizontal"
      navbar={
        <Sidebar
          navLinks={[
            {
              type: "anchor",
              label: "Boards",
              path: "/app/boards",
              icon: (isActive) => (isActive ? <RiHomeFill /> : <RiHomeLine />)
            },
            {
              type: "anchor",
              label: "Profile",
              path: "/app/profile",
              icon: (isActive) => (isActive ? <RiSettingsFill /> : <RiSettingsLine />)
            }
          ]}
          actionLinks={[
            {
              type: "action",
              label: "Logout",
              onClick: () => {
                console.log("TODO: logout");
                navigate({
                  to: "/"
                });
              },
              icon: () => <RiLogoutBoxLine />
            }
          ]}
        />
      }
    />
  );
};
