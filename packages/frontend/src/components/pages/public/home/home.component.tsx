import { FC } from "react";
import styles from "./home.module.scss";
import { Heading } from "@/atoms/typography/heading";
import { Text } from "@/atoms/typography/text";

export const Component: FC = () => {
  return (
    <div className={styles.home}>
      <Heading size={1} weight={500}>
        Kanban web app
      </Heading>
      <Text>This project is not finished. Register or login to see the current state.</Text>
    </div>
  );
};
