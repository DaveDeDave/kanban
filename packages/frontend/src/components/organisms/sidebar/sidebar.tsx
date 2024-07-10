import { forwardRef } from "react";
import classNames from "classnames";
import ReactLogo from "@/assets/react.svg";
import styles from "./sidebar.module.scss";
import { NavLinkProps } from "@/atoms/nav-links/navlink.types";
import { SidebarNavLink } from "@/atoms/nav-links/sidebar-nav-link";

export interface SidebarProps {
  navLinks: NavLinkProps[];
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ navLinks }, ref) => {
  return (
    <nav ref={ref} className={classNames(styles.sidebar)}>
      <div className={styles.topSection}>
        <img width="35" src={ReactLogo} />
      </div>
      <div className={styles.middleSection}>
        <ul className={styles.linksList}>
          {navLinks.map(({ label, path }, key) => (
            <li key={key}>
              <SidebarNavLink label={label} path={path} />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.bottomSection}>
        <SidebarNavLink label={"Logout"} path={"/app"} />
      </div>
    </nav>
  );
});
