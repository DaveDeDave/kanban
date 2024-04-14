import { FC, ReactNode } from "react";
import styles from "./column-head.module.scss";

interface ColumnHeadProps {
  title: string;
  color?: string;
  numberOfTasks: number;
  actions?: { onClick: () => void; icon: ReactNode }[];
}

export const ColumnHead: FC<ColumnHeadProps> = ({ title, color, numberOfTasks, actions }) => {
  return (
    <div
      className={styles.columnHead}
      style={{
        backgroundColor: color
      }}
    >
      <div className={styles.numberOfTasks}>
        <span>{numberOfTasks}</span>
      </div>
      <div className={styles.title}>
        <span>{title}</span>
      </div>
      {actions && (
        <div className={styles.actions}>
          {actions.map((action, key) => (
            <div key={key} onClick={action.onClick} className={styles.action}>
              {action.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
