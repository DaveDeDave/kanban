import { FC } from "react";
import styles from "./board-header.module.scss";
import { Heading } from "@/atoms/typography/heading";
import { Text } from "@/atoms/typography/text";
import { Button } from "@/atoms/button";
import { RiDeleteBinLine, RiPencilLine } from "@remixicon/react";
import { t } from "i18next";

export interface BoardHeaderProps {
  name: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const BoardHeader: FC<BoardHeaderProps> = ({ name, description }) => {
  return (
    <div className={styles.boardHeader}>
      <div>
        <Heading size={1} weight={600}>
          {name}
        </Heading>
        <Text>{description}</Text>
      </div>
      <div className={styles.buttons}>
        <Button
          variant="primary"
          leftIcon={<RiPencilLine />}
          label={t("components.organisms.boardHeader.buttons.edit")}
        />
        <Button
          variant="secondary"
          leftIcon={<RiDeleteBinLine />}
          label={t("components.organisms.boardHeader.buttons.delete")}
        />
      </div>
    </div>
  );
};
