import { FC } from "react";
import styles from "./task-card.module.scss";
import { RiDeleteBin2Line, RiMoreFill, RiPencilLine } from "@remixicon/react";
import { Text } from "@/atoms/typography/text";
import { ButtonDropdown } from "@/atoms/button-dropdown";
import { t } from "i18next";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  onUpdate: (task: { id: string; title: string; description: string }) => void;
  onDelete: (task: { id: string; title: string }) => void;
}

export const TaskCard: FC<TaskCardProps> = ({ id, title, description, onUpdate, onDelete }) => {
  return (
    <div className={styles.taskCard}>
      <div className={styles.head}>
        <div className={styles.title}>
          <Text type="label" weight={600}>
            {title}
          </Text>
        </div>
        <ButtonDropdown
          dropdown={{
            align: "end",
            items: [
              {
                label: t("general.label.update"),
                onClick: () =>
                  onUpdate({
                    id,
                    title,
                    description
                  }),
                icon: <RiPencilLine />
              },
              {
                label: t("general.label.delete"),
                onClick: () => onDelete({ id, title }),
                destructive: true,
                icon: <RiDeleteBin2Line />
              }
            ]
          }}
          icon={<RiMoreFill />}
        />
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
