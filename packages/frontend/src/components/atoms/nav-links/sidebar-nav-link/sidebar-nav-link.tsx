import { Link as RouterNavLink, useLocation } from "@tanstack/react-router";
import { forwardRef, ReactNode, useMemo } from "react";
import classNames from "classnames";
import styles from "./sidebar-nav-link.module.scss";
import { NavLinkActionProps, NavLinkAnchorProps, NavLinkProps } from "../navlink.types";

export type SidebarNavLinkProps = NavLinkProps & {
  icon: (isActive: boolean) => ReactNode;
};

export type SidebarNavLinkActionProps = NavLinkActionProps & {
  icon: (isActive: boolean) => ReactNode;
};

export const SidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ icon, ...props }, ref) => {
    const location = useLocation();

    const isAnchorLink = useMemo(() => props.type === "anchor", [props.type]);

    const isActive = useMemo(
      () => isAnchorLink && location.pathname === (props as NavLinkAnchorProps).path,
      [location.pathname, isAnchorLink, props]
    );

    return (
      <RouterNavLink
        ref={ref}
        to={isAnchorLink ? (props as NavLinkAnchorProps).path : undefined}
        onClick={
          !isAnchorLink
            ? (e) => {
                e.preventDefault();
                (props as NavLinkActionProps).onClick();
              }
            : undefined
        }
        className={classNames(styles.sidebarNavLink, isActive && styles.active)}
      >
        {icon(isActive)}
      </RouterNavLink>
    );
  }
);
