import { useGetBoards } from "@/hooks/trpc/board/getBoards.hook";
import { BoardCard } from "@/molecules/board-card";
import { FC } from "react";
import styles from "../boards.module.scss";
import { useNavigate } from "@tanstack/react-router";
import { Text } from "@/atoms/typography/text";
import { Heading } from "@/atoms/typography/heading";
import { t } from "i18next";
import { Button } from "@/atoms/button";
import { RiAddLine, RiKanbanView } from "@remixicon/react";

export interface BoardListProps {
  onCreateBoard: () => void;
  onUpdateBoard: (board: { id: string; name: string; description: string }) => void;
  onDeleteBoard: (id: string) => void;
}

export const BoardList: FC<BoardListProps> = ({ onCreateBoard, onUpdateBoard, onDeleteBoard }) => {
  const { data: boardsData, isLoading, isError } = useGetBoards();

  const navigate = useNavigate();

  const handleOpen = (id: string) => {
    navigate({
      to: `/app/boards/${id}`
    });
  };

  if (isLoading) {
    return "TODO: loading state";
  }

  if (isError) {
    return "TODO: error state";
  }

  if (boardsData.boards.length === 0) {
    return (
      <div className={styles.createBoard}>
        <span className={styles.icon}>
          <RiKanbanView />
        </span>
        <div>
          <Heading size={2}>{t("pages.boards.welcome.title")}</Heading>
          <Text>{t("pages.boards.welcome.description")}</Text>
        </div>
        <Button
          leftIcon={<RiAddLine />}
          label={t("pages.boards.welcome.button")}
          onClick={onCreateBoard}
        />
      </div>
    );
  }

  return (
    <div className={styles.boardListWrapper}>
      <Button
        leftIcon={<RiAddLine />}
        label={t("pages.boards.welcome.button")}
        onClick={onCreateBoard}
      />
      <div className={styles.boardList}>
        {boardsData.boards.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            title={board.name}
            description={board.description}
            createdAt={new Date(board.createdAt)}
            onOpen={handleOpen}
            onEdit={(id) => {
              onUpdateBoard({
                id,
                name: board.name,
                description: board.description
              });
            }}
            onDelete={(id) => {
              onDeleteBoard(id);
            }}
          />
        ))}
      </div>
    </div>
  );
};
