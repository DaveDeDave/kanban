import { BoardListElement } from "@/atoms/board-list-element";
import { FC } from "react";
import styles from "./board-list.module.scss";
import { Text } from "@/atoms/typography/text";
import { RiDownloadCloud2Line } from "@remixicon/react";

interface Board {
  id: string;
  name: string;
}

export interface BoardListProps {
  boards: Board[];
  activeBoardId: string;
  isThereMore?: boolean;
  isLoadingMore?: boolean;
  loadMore?: () => void;
  onChangeActiveBoard: (boardId: string) => void;
}

export const BoardList: FC<BoardListProps> = ({
  boards,
  activeBoardId,
  isThereMore,
  isLoadingMore,
  loadMore,
  onChangeActiveBoard
}) => {
  if (boards.length === 0) {
    return <Text size="sm">There isn't any board</Text>;
  }

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
      {isLoadingMore ? (
        // Add loading state
        <BoardListElement icon={<RiDownloadCloud2Line />} name="Loading..." />
      ) : isThereMore && loadMore ? (
        <BoardListElement
          icon={<RiDownloadCloud2Line />}
          name="Load more"
          onClick={() => loadMore()}
        />
      ) : null}
    </ul>
  );
};
