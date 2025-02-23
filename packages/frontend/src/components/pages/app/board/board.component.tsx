import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";
import { AddColumnButton } from "@/atoms/add-kanban-column-button";
import { BoardModals, useBoardModals } from "./modals";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  const boardModals = useBoardModals();

  const {
    data: boardData,
    isLoading,
    error
  } = useGetBoard({
    boardId
  });

  if (isLoading) {
    return <></>;
  }

  if (error || !boardData) {
    return "TODO: handle errors (e.g. 404, 500)";
  }

  return (
    <>
      <BoardModals currentBoardId={boardId} {...boardModals} />
      <div className={styles.board}>
        <BoardHeader
          name={boardData.board.name}
          description={boardData.board.description}
          onEdit={() => {
            boardModals.showEditBoardModal({
              id: boardId,
              name: boardData.board.name,
              description: boardData.board.description
            });
          }}
          onDelete={() => {
            boardModals.showDeleteBoardModal(boardData.board.id);
          }}
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
              onEditClick={() => {
                boardModals.showEditColumnModal({
                  id: column.id,
                  name: column.name,
                  color: column.color
                });
              }}
              onAddClick={() => {
                boardModals.showCreateTaskModal({
                  columnId: column.id
                });
              }}
            />
          ))}

          <AddColumnButton onClick={boardModals.showCreateColumnModal} />
        </div>
      </div>
    </>
  );
};
