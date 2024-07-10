import { Link as RouterNavLink, useLocation } from "@tanstack/react-router";
import { forwardRef } from "react";
import classNames from "classnames";
import styles from "./sidebar-nav-link.module.scss";
import { NavLinkProps } from "../navlink.types";

export const SidebarNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ label, path }, ref) => {
    const location = useLocation();

    return (
      <div
        className={classNames(styles.sidebarNavLink, location.pathname === path && styles.active)}
      >
        <RouterNavLink ref={ref} to={path} className={styles.link}>
          {label}
        </RouterNavLink>
      </div>
    );
  }
);
