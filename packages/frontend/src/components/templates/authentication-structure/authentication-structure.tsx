import { Link, Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { FC, useContext } from "react";
import styles from "./authentication-structure.module.scss";
import ReactLogo from "@/assets/react.svg";
import Bg from "@/assets/login-bg.webp";
import { AppContext } from "@/contexts/app.context";

export const AuthenticationStructure: FC = () => {
  const appContext = useContext(AppContext);
  const location = useLocation();

  if (!appContext) {
    return "";
  }

  if (appContext.isUserLoggedIn) {
    return <Navigate to="/app/boards" replace />;
  }

  if (location.pathname === "/auth") {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className={styles.authenticationStructure}>
      <div className={styles.contentWrapper}>
        <Link to="/" style={{ width: "fit-content" }}>
          <img
            width="35"
            src={ReactLogo}
            style={{
              alignSelf: "flex-start"
            }}
          />
        </Link>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <div
        className={styles.bg}
        style={{
          backgroundImage: `url("${Bg}")`
        }}
      />
    </div>
  );
};
