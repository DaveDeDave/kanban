import { FC } from "react";
import styles from "./board-card.module.scss";
import dayjs from "dayjs";
import { Heading } from "@/atoms/typography/heading";
import {
  RiCalendarEventFill,
  RiDeleteBin2Line,
  RiEyeLine,
  RiMoreFill,
  RiPencilLine
} from "@remixicon/react";
import { Text } from "@/atoms/typography/text";
import { Button } from "@/atoms/button";
import { ButtonDropdown } from "@/atoms/button-dropdown";
import { t } from "i18next";
import { Divider } from "@/atoms/divider";
import { Tag } from "@/atoms/tag";

export interface BoardCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BoardCard: FC<BoardCardProps> = ({
  id,
  title,
  description,
  createdAt,
  onOpen,
  onEdit,
  onDelete
}) => {
  return (
    <div className={styles.boardCard}>
      <div className={styles.header}>
        <Tag icon={<RiCalendarEventFill />} label={dayjs(createdAt).format("YYYY/M/D")} />
        <ButtonDropdown
          dropdown={{
            align: "end",
            items: [
              {
                label: "Edit",
                onClick: () => onEdit(id),
                icon: <RiPencilLine />
              },
              {
                label: "Delete",
                onClick: () => onDelete(id),
                icon: <RiDeleteBin2Line />
              }
            ]
          }}
          icon={<RiMoreFill />}
        />
      </div>
      <div className={styles.content}>
        <Heading withoutMargins size={6} weight={500}>
          {title}
        </Heading>
        <Text withoutMargins size="sm" maxLines={3}>
          {description}
        </Text>
      </div>
      <Divider variant="light" />
      <div className={styles.footer}>
        <Button
          leftIcon={<RiEyeLine />}
          onClick={() => onOpen(id)}
          label={t("components.molecules.boardCard.buttons.view")}
        />
      </div>
    </div>
  );
};
