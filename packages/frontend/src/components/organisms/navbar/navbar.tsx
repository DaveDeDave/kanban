import { forwardRef } from "react";
import classNames from "classnames";
import { NavLink, NavLinkProps } from "@/atoms/nav-link";
import ReactLogo from "@/assets/react.svg";
import styles from "./navbar.module.scss";
import { Button } from "@/atoms/button";

export interface NavbarProps {
  navLinks: NavLinkProps[];
  sticky?: boolean;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(({ navLinks, sticky }, ref) => {
  return (
    <nav ref={ref} className={classNames(styles.navbar, sticky && styles.sticky)}>
      <div className={styles.leftSection}>
        <img width="35" src={ReactLogo} />
      </div>
      <div className={styles.middleSection}>
        <ul className={styles.linksList}>
          {navLinks.map(({ label, path }, key) => (
            <li key={key}>
              <NavLink label={label} path={path} />
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
