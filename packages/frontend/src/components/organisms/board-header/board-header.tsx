import { FC } from "react";
import styles from "./board-header.module.scss";
import { Text } from "@/atoms/typography/text";
import { Button } from "@/atoms/button";
import { RiDeleteBinLine, RiPencilLine } from "@remixicon/react";
import { t } from "i18next";

export interface BoardHeaderProps {
  name: string;
  description: string;
  onUpdate: () => void;
  onDelete: () => void;
}

export const BoardHeader: FC<BoardHeaderProps> = ({ description, onUpdate, onDelete }) => {
  return (
    <div className={styles.boardHeader}>
      <div>
        <Text withoutMargins weight={500}>
          {t("pages.board.header.boardDescription")}
        </Text>
        <Text withoutMargins>{description}</Text>
      </div>
      <div className={styles.buttons}>
        <Button
          variant="primary"
          leftIcon={<RiPencilLine />}
          label={t("components.organisms.boardHeader.buttons.update")}
          onClick={onUpdate}
        />
        <Button
          variant="secondary"
          destructive
          leftIcon={<RiDeleteBinLine />}
          label={t("components.organisms.boardHeader.buttons.delete")}
          onClick={onDelete}
        />
      </div>
    </div>
  );
};
