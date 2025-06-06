import { FC } from "react";
import styles from "./board-list-element.module.scss";
import textStyles from "@/atoms/typography/text/text.module.scss";
import classNames from "classnames";
import { ReactNode } from "@tanstack/react-router";

interface BoardListElement {
  name: string;
  icon?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const BoardListElement: FC<BoardListElement> = ({ name, icon, isActive, onClick }) => {
  return (
    <li
      className={classNames(
        styles.boardListElement,
        textStyles.text,
        textStyles.label,
        isActive && textStyles["text-weight-500"],
        isActive && styles.isActive
      )}
      onClick={onClick}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{name}</span>
    </li>
  );
};
