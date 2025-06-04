import { useGetBoards } from "@/hooks/trpc/board/getBoards.hook";
import { BoardCard } from "@/molecules/board-card";
import { FC } from "react";
import styles from "../boards.module.scss";
import { useNavigate } from "@tanstack/react-router";

export const BoardList: FC = () => {
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

  return (
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
            console.log("edit", id);
          }}
          onDelete={(id) => {
            console.log("delete", id);
          }}
        />
      ))}
    </div>
  );
};
