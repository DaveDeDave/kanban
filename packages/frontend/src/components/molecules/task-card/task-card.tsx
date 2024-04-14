import { FC } from "react";
import styles from "./task-card.module.scss";
import { RiMoreFill } from "@remixicon/react";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
}

export const TaskCard: FC<TaskCardProps> = ({ title, description }) => {
  return (
    <div className={styles.taskCard}>
      <div className={styles.head}>
        <div className={styles.title}>
          <span>{title}</span>
        </div>
        <div className={styles.actions}>
          <RiMoreFill />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.description}>
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
};
