import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC, useState } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";
import { AddColumnButton } from "@/atoms/add-kanban-column-button";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { CreateColumnModal } from "@/molecules/modals/create-column-modal";
import { CreateTaskModal } from "@/molecules/modals/create-task-modal";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  const { isOpen, showModal, hideModal } = useModal();

  const [createTask, setCreateTask] = useState<{ columnId: string } | null>(null);

  const { data: boardData, error } = useGetBoard({
    boardId
  });

  if (error || !boardData) {
    return "TODO: handle errors (e.g. 404, 500)";
  }

  return (
    <>
      <CreateTaskModal
        columnId={createTask?.columnId}
        open={createTask !== null}
        onClose={() => setCreateTask(null)}
      />
      <CreateColumnModal boardId={boardId} open={isOpen} onClose={hideModal} />
      <div className={styles.board}>
        <BoardHeader
          name={boardData.board.name}
          description={boardData.board.description}
          onEdit={() => {}}
          onDelete={() => {}}
        />
        <div className={styles.columns}>
          {boardData.board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              head={{
                title: column.name,
                color: column.color
              }}
              tasks={column.tasks}
              onEditClick={() => {}}
              onAddClick={() => {
                setCreateTask({
                  columnId: column.id
                });
              }}
            />
          ))}

          <AddColumnButton onClick={showModal} />
        </div>
      </div>
    </>
  );
};
