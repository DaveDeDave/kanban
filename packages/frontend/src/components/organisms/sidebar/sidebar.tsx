import { forwardRef } from "react";
import classNames from "classnames";
import ReactLogo from "@/assets/react.svg";
import styles from "./sidebar.module.scss";
import {
  SidebarNavLink,
  SidebarNavLinkActionProps,
  SidebarNavLinkProps
} from "@/atoms/nav-links/sidebar-nav-link";

export interface SidebarProps {
  navLinks: SidebarNavLinkProps[];
  actionLinks: SidebarNavLinkActionProps[];
  className?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ navLinks, actionLinks, className }, ref) => {
    return (
      <nav ref={ref} className={classNames(styles.sidebar, className)}>
        <div className={styles.topSection}>
          <img width="35" src={ReactLogo} />
        </div>
        <div className={styles.middleSection}>
          <ul className={styles.linksList}>
            {navLinks.map(({ label, icon, ...props }, key) => (
              <li key={key}>
                <SidebarNavLink icon={icon} label={label} {...props} />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.bottomSection}>
          <ul className={styles.linksList}>
            {actionLinks.map(({ label, icon, ...props }, key) => (
              <li key={key}>
                <SidebarNavLink icon={icon} label={label} {...props} />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
);
