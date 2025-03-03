import { FC, useContext } from "react";
import { AppStructure } from "../app-structure";
import { Sidebar, SidebarProps } from "@/organisms/sidebar/sidebar";
import {
  RiDashboardFill,
  RiDashboardLine,
  RiLogoutBoxLine,
  RiSettingsFill,
  RiSettingsLine
} from "@remixicon/react";
import { Navigate } from "@tanstack/react-router";
import { AppContext } from "@/contexts/app.context";
import { LogoutModal } from "@/molecules/modals/logout-modal";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import styles from "./authenticated-area-structure.module.scss";
import { AuthHeader } from "@/organisms/auth-header";

export const AuthenticatedAreaStructure: FC = () => {
  const appContext = useContext(AppContext);

  const { isOpen, showModal, hideModal } = useModal();

  const navLinks: SidebarProps["navLinks"] = [
    {
      type: "anchor",
      label: "Boards",
      path: "/app/boards",
      icon: (isActive) => (isActive ? <RiDashboardFill /> : <RiDashboardLine />)
    },
    {
      type: "anchor",
      label: "Profile",
      path: "/app/profile",
      icon: (isActive) => (isActive ? <RiSettingsFill /> : <RiSettingsLine />)
    }
  ];

  const actionLinks: SidebarProps["actionLinks"] = [
    {
      type: "action",
      label: "Logout",
      onClick: () => {
        showModal();
      },
      icon: () => <RiLogoutBoxLine />
    }
  ];

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
        className={styles.authArea}
        orientation="horizontal"
        header={
          <AuthHeader className={styles.header} navLinks={navLinks} actionLinks={actionLinks} />
        }
        navbar={
          <Sidebar className={styles.sidebar} navLinks={navLinks} actionLinks={actionLinks} />
        }
      />
    </>
  );
};
