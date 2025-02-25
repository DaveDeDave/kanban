import { FC, useContext } from "react";
import { AppStructure } from "../app-structure";
import { Sidebar } from "@/organisms/sidebar/sidebar";
import {
  RiHomeFill,
  RiHomeLine,
  RiLogoutBoxLine,
  RiSettingsFill,
  RiSettingsLine
} from "@remixicon/react";
import { Navigate } from "@tanstack/react-router";
import { AppContext } from "@/contexts/app.context";
import { LogoutModal } from "@/molecules/modals/logout-modal";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";

export const AuthenticatedAreaStructure: FC = () => {
  const appContext = useContext(AppContext);

  const { isOpen, showModal, hideModal } = useModal();

  if (!appContext) {
    return "";
  }

  if (!appContext.isUserLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <LogoutModal open={isOpen} onClose={hideModal} />
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
                  showModal();
                },
                icon: () => <RiLogoutBoxLine />
              }
            ]}
          />
        }
      />
    </>
  );
};
