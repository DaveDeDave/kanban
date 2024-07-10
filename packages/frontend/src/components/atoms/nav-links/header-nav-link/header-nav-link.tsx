import { Link as RouterNavLink, useLocation } from "@tanstack/react-router";
import { forwardRef } from "react";
import classNames from "classnames";
import styles from "./header-nav-link.module.scss";
import { NavLinkProps } from "../navlink.types";

export const HeaderNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ label, path }, ref) => {
  const location = useLocation();

  return (
    <RouterNavLink
      ref={ref}
      to={path}
      className={classNames(styles.headerNavLink, location.pathname === path && styles.active)}
    >
      {label}
    </RouterNavLink>
  );
});
