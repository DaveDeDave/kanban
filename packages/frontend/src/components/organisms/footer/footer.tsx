import { forwardRef } from "react";
import styles from "./footer.module.scss";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <span>Footer</span>
    </footer>
  );
});
