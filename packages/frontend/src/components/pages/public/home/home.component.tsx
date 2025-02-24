import { FC } from "react";
import styles from "./home.module.scss";

export const Component: FC = () => {
  return (
    <div className={styles.home}>
      <h1>Home</h1>
      <p>This project is not finished. Register or login to see the current state.</p>
      {new Array(10).fill(null).map((_, key) => (
        <p key={key}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Lacus luctus accumsan tortor posuere ac ut consequat
          semper. Nec ultrices dui sapien eget mi. Diam phasellus vestibulum lorem sed risus
          ultricies tristique nulla. Id eu nisl nunc mi ipsum faucibus vitae aliquet. Pellentesque
          habitant morbi tristique senectus. Ac ut consequat semper viverra nam. Nibh cras pulvinar
          mattis nunc. Etiam tempor orci eu lobortis elementum nibh tellus molestie nunc. Nulla
          pharetra diam sit amet nisl suscipit.
        </p>
      ))}
    </div>
  );
};
