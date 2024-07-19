import { RouterOutputs } from "@/config/trpc.config";
import { FC } from "react";
import styles from "./board-list.module.scss";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import textStyles from "@/atoms/typography/text/text.module.scss";

interface BoardListProps {
  boards: RouterOutputs["board"]["getBoards"]["boards"];
}

export const BoardList: FC<BoardListProps> = ({ boards }) => {
  return (
    <div className={styles.boardListWrapper}>
      <ul className={styles.boardList}>
        {boards.map((board) => (
          <li className={styles.boardItem}>
            <Link
              to={`/app/boards/${board.id}`}
              className={classNames(textStyles.text, textStyles.label, textStyles["text-size-md"])}
            >
              {board.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
