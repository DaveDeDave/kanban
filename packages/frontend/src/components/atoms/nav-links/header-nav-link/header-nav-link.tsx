import { Link as RouterNavLink, useLocation } from "@tanstack/react-router";
import { forwardRef, useMemo } from "react";
import classNames from "classnames";
import styles from "@/atoms/typography/text/text.module.scss";
import { NavLinkAnchorProps } from "../navlink.types";

export const HeaderNavLink = forwardRef<HTMLAnchorElement, NavLinkAnchorProps>(
  ({ label, path }, ref) => {
    const location = useLocation();

    const isActive = useMemo(() => location.pathname === path, [location.pathname, path]);

    return (
      <RouterNavLink
        ref={ref}
        to={path}
        className={classNames(styles.text, styles.link, isActive && styles.active)}
      >
        {label}
      </RouterNavLink>
    );
  }
);
