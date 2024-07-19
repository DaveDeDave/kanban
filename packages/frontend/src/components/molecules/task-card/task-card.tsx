import { FC } from "react";
import styles from "./task-card.module.scss";
import { RiMoreFill } from "@remixicon/react";
import { Text } from "@/atoms/typography/text";

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
          <Text type="label" weight={600}>
            {title}
          </Text>
        </div>
        <div className={styles.actions}>
          <RiMoreFill />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.description}>
          <Text type="paragraph" size="sm">
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
};
