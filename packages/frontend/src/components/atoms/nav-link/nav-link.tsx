import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import classNames from "classnames";
import styles from "./nav-link.module.scss";

export interface NavLinkProps {
  label: string;
  path: string;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ label, path }, ref) => {
  return (
    <RouterNavLink
      ref={ref}
      to={path}
      className={({ isActive }) => classNames(styles.navLink, isActive && styles.active)}
    >
      {label}
    </RouterNavLink>
  );
});
