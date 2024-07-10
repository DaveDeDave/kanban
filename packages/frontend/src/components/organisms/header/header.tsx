import { forwardRef } from "react";
import classNames from "classnames";
import { HeaderNavLink } from "@/atoms/nav-links/header-nav-link";
import ReactLogo from "@/assets/react.svg";
import styles from "./header.module.scss";
import { Button } from "@/atoms/button";
import { NavLinkProps } from "@/atoms/nav-links/navlink.types";

export interface HeaderProps {
  navLinks: NavLinkProps[];
  sticky?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(({ navLinks, sticky }, ref) => {
  return (
    <nav ref={ref} className={classNames(styles.header, sticky && styles.sticky)}>
      <div className={styles.leftSection}>
        <img width="35" src={ReactLogo} />
      </div>
      <div className={styles.middleSection}>
        <ul className={styles.linksList}>
          {navLinks.map(({ label, path }, key) => (
            <li key={key}>
              <HeaderNavLink label={label} path={path} />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.rightSection}>
        <Button variant="primary" label="Login" />
        <Button variant="primary" label="Regiser" />
      </div>
    </nav>
  );
});
