import { FC, useState } from "react";
import styles from "./task-card.module.scss";
import { RiDeleteBin2Line, RiMoreFill, RiPencilLine } from "@remixicon/react";
import { Text } from "@/atoms/typography/text";
import { Dropdown } from "@/atoms/dropdown";
import classNames from "classnames";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  onEdit: (task: { id: string; title: string; description: string }) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: FC<TaskCardProps> = ({ id, title, description, onEdit, onDelete }) => {
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);

  return (
    <div className={styles.taskCard}>
      <div className={styles.head}>
        <div className={styles.title}>
          <Text type="label" weight={600}>
            {title}
          </Text>
        </div>
        <Dropdown
          onOpenChange={(open) => setActionsDropdownOpen(open)}
          align="end"
          items={[
            {
              label: "Edit",
              onClick: () =>
                onEdit({
                  id,
                  title,
                  description
                }),
              icon: <RiPencilLine />
            },
            {
              label: "Delete",
              onClick: () => onDelete(id),
              icon: <RiDeleteBin2Line />
            }
          ]}
        >
          <div className={classNames(styles.actions, actionsDropdownOpen && styles.open)}>
            <RiMoreFill />
          </div>
        </Dropdown>
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
