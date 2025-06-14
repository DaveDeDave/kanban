import { FC, useState } from "react";
import { SidebarProps } from "../sidebar/sidebar";
import styles from "./auth-header.module.scss";
import classNames from "classnames";
import ReactLogo from "@/assets/react.svg";
import { IconButton } from "@/atoms/icon-button";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import { SidebarNavLink } from "@/atoms/nav-links/sidebar-nav-link";

export interface AuthHeaderProps extends SidebarProps {}

export const AuthHeader: FC<SidebarProps> = ({ navLinks, actionLinks, className }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={classNames(styles.authHeader, className)}>
      <img width="35" src={ReactLogo} />
      <IconButton
        variant="secondary"
        icon={menuOpen ? <RiCloseLine /> : <RiMenuLine />}
        onClick={() => setMenuOpen((open) => !open)}
      />
      <div className={classNames(styles.menu, menuOpen ? styles.open : styles.closed)}>
        <div className={styles.navLinks}>
          {navLinks.map(({ icon, label, ...props }, key) => (
            <SidebarNavLink
              key={key}
              expanded
              icon={icon}
              label={label}
              onClickLink={() => {
                setMenuOpen(false);
              }}
              {...props}
            />
          ))}
        </div>
        <div className={styles.actionLinks}>
          {actionLinks.map(({ icon, label, ...props }, key) => (
            <SidebarNavLink key={key} expanded icon={icon} label={label} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};
