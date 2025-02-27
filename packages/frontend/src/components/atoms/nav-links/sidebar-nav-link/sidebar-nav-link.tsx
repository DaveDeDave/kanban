import { Link as RouterNavLink, useLocation } from "@tanstack/react-router";
import { forwardRef, ReactNode, useMemo } from "react";
import classNames from "classnames";
import styles from "./sidebar-nav-link.module.scss";
import { NavLinkActionProps, NavLinkAnchorProps, NavLinkProps } from "../navlink.types";
import { Tooltip } from "@/atoms/tooltip";

export type SidebarNavLinkProps = NavLinkProps & {
  icon: (isActive: boolean) => ReactNode;
  onClickLink?: () => void;
  expanded?: boolean;
};

export type SidebarNavLinkActionProps = NavLinkActionProps & {
  icon: (isActive: boolean) => ReactNode;
};

export const SidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ icon, label, expanded, onClickLink, ...props }, ref) => {
    const location = useLocation();

    const isAnchorLink = useMemo(() => props.type === "anchor", [props.type]);

    const isActive = useMemo(
      () => isAnchorLink && location.pathname.startsWith((props as NavLinkAnchorProps).path!),
      [location.pathname, isAnchorLink, props]
    );

    return (
      <Tooltip variant="secondary" side="right" content={label}>
        <RouterNavLink
          ref={ref}
          to={isAnchorLink ? (props as NavLinkAnchorProps).path : undefined}
          onClick={
            !isAnchorLink
              ? (e) => {
                  e.preventDefault();
                  (props as NavLinkActionProps).onClick();
                }
              : () => {
                  if (onClickLink) {
                    setTimeout(() => {
                      onClickLink?.();
                    }, 100);
                  }
                }
          }
          className={classNames(
            styles.sidebarNavLink,
            isActive && styles.active,
            expanded && styles.expanded
          )}
        >
          {icon(isActive)} {expanded ? label : ""}
        </RouterNavLink>
      </Tooltip>
    );
  }
);
