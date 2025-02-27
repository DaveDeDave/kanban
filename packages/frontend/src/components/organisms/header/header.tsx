import { forwardRef, useContext } from "react";
import classNames from "classnames";
import { HeaderNavLink } from "@/atoms/nav-links/header-nav-link";
import ReactLogo from "@/assets/react.svg";
import styles from "./header.module.scss";
import { Button } from "@/atoms/button";
import { NavLinkAnchorProps } from "@/atoms/nav-links/navlink.types";
import { Link } from "@tanstack/react-router";
import { AppContext } from "@/contexts/app.context";

export interface HeaderProps {
  navLinks: NavLinkAnchorProps[];
  sticky?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(({ navLinks, sticky }, ref) => {
  const appContext = useContext(AppContext);

  return (
    <nav ref={ref} className={classNames(styles.header, sticky && styles.sticky)}>
      <div className={styles.leftSection}>
        <img width="35" src={ReactLogo} />
      </div>
      <div className={styles.middleSection}>
        <ul className={styles.linksList}>
          {navLinks.map(({ label, path }, key) => (
            <li key={key}>
              <HeaderNavLink type="anchor" label={label} path={path} />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.rightSection}>
        {appContext!.isUserLoggedIn ? (
          <>
            <Link
              to="/app/boards"
              style={{
                textDecoration: "none"
              }}
            >
              <Button variant="primary" label="Dashboard" />
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/auth/login"
              style={{
                textDecoration: "none"
              }}
            >
              <Button variant="primary" label="Login" />
            </Link>
            <Link
              className={styles.registerButton}
              to="/auth/register"
              style={{
                textDecoration: "none"
              }}
            >
              <Button variant="primary" label="Regiser" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
});
