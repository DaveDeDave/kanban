import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  const { data: boardData, error } = useGetBoard({
    boardId
  });

  if (error || !boardData) {
    return "TODO: handle errors (e.g. 404, 500)";
  }

  return (
    <div className={styles.board}>
      <BoardHeader
        name={boardData.board.name}
        description={boardData.board.description}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <div className={styles.columns}>
        <KanbanColumn
          head={{
            title: "To do"
          }}
          tasks={[
            {
              id: "1",
              title: "test",
              description: "test"
            }
          ]}
          onEditClick={() => {}}
          onAddClick={() => {}}
        />
        <KanbanColumn
          head={{
            title: "Done"
          }}
          tasks={[
            {
              id: "1",
              title: "test",
              description: "test"
            }
          ]}
          onEditClick={() => {}}
          onAddClick={() => {}}
        />
      </div>
    </div>
  );
};
