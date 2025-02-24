import { FC } from "react";
import styles from "./board-list-element.module.scss";
import textStyles from "@/atoms/typography/text/text.module.scss";
import classNames from "classnames";

interface BoardListElement {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const BoardListElement: FC<BoardListElement> = ({ name, isActive, onClick }) => {
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
      {name}
    </li>
  );
};
