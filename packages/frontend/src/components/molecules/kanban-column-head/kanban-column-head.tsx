import { FC, ReactNode } from "react";
import styles from "./kanban-column-head.module.scss";
import { Heading } from "@/atoms/typography/heading";
import { RiSettings4Line } from "@remixicon/react";
import { Dropdown } from "@/atoms/dropdown";
import classNames from "classnames";

export interface KanbanColumnHeadProps {
  title: string;
  color?: string;
  numberOfTasks: number;
  actions?: { onClick: () => void; icon: ReactNode }[];
  settings?: { onClick: () => void; label: string; icon: ReactNode; destructive?: boolean }[];
  className?: string;
}

export const KanbanColumnHead: FC<KanbanColumnHeadProps> = ({
  title,
  color,
  numberOfTasks,
  actions,
  settings,
  className
}) => {
  return (
    <div
      className={classNames(styles.kanbanColumnHead, className)}
      style={{
        backgroundColor: color
      }}
    >
      <div className={styles.numberOfTasks}>
        <span>{numberOfTasks}</span>
      </div>
      <div className={styles.title}>
        <Heading size={6} weight={600} withoutMargins>
          {title}
        </Heading>
      </div>
      {actions || settings ? (
        <div className={styles.actions}>
          {actions
            ? actions.map((action, key) => (
                <div key={key} onClick={action.onClick} className={styles.action}>
                  {action.icon}
                </div>
              ))
            : null}
          {settings ? (
            <Dropdown items={settings} align="end">
              <div className={styles.action}>
                <RiSettings4Line />
              </div>
            </Dropdown>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
