import { RiAddLine } from "@remixicon/react";
import { FC } from "react";
import styles from "./add-kanban-column-button.module.scss";

export interface AddColumnButtonProps {
  onClick?: () => void;
}

export const AddColumnButton: FC<AddColumnButtonProps> = ({ ...props }) => {
  return (
    <div className={styles.addColumnButton} tabIndex={0} {...props}>
      <RiAddLine />
    </div>
  );
};
