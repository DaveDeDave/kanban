import { BoardListElement } from "@/atoms/board-list-element";
import { FC } from "react";
import styles from "./board-list.module.scss";

interface Board {
  id: string;
  name: string;
}

export interface BoardListProps {
  boards: Board[];
  activeBoardId: string;
  onChangeActiveBoard: (boardId: string) => void;
}

export const BoardList: FC<BoardListProps> = ({ boards, activeBoardId, onChangeActiveBoard }) => {
  return (
    <ul className={styles.boardList}>
      {boards.map(({ id, name }) => (
        <BoardListElement
          key={id}
          name={name}
          isActive={activeBoardId === id}
          onClick={() => onChangeActiveBoard(id)}
        />
      ))}
    </ul>
  );
};
