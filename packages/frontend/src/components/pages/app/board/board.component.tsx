import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  return (
    <div className={styles.board}>
      <BoardHeader
        name={`Board ${boardId}`}
        description={`This is the board ${boardId}`}
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
