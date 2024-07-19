import { Link as RouterNavLink, useLocation } from "@tanstack/react-router";
import { forwardRef, ReactNode, useMemo } from "react";
import classNames from "classnames";
import styles from "./sidebar-nav-link.module.scss";
import { NavLinkProps } from "../navlink.types";

interface SidebarNavLinkProps extends NavLinkProps {
  icon: (isActive: boolean) => ReactNode;
}

export const SidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ icon, path }, ref) => {
    const location = useLocation();

    const isActive = useMemo(() => location.pathname === path, [location.pathname, path]);

    return (
      <RouterNavLink
        ref={ref}
        to={path}
        className={classNames(styles.sidebarNavLink, isActive && styles.active)}
      >
        {icon(isActive)}
      </RouterNavLink>
    );
  }
);
