import { ReactNode } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./tag.module.scss";
import { Text } from "../typography/text";

export interface TagProps {
  icon?: ReactNode;
  label: string;
}

export const Tag: FC<TagProps> = ({ icon, label }) => {
  return (
    <div className={styles.tag}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <Text className={styles.label} type="label" weight={500} size="sm">
        {label}
      </Text>
    </div>
  );
};
