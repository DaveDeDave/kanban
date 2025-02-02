import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC, useState } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";
import { AddColumnButton } from "@/atoms/add-kanban-column-button";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { CreateTaskModal } from "@/molecules/modals/create-task-modal";
import { CreateColumnModal } from "@/molecules/modals/column-modals/create-column-modal";
import { UpdateColumnModal } from "@/molecules/modals/column-modals/update-column-modal";
import { DeleteBoardModal, UpdateBoardModal } from "@/molecules/modals/board-modals";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  const { isOpen, showModal, hideModal } = useModal();

  const [createTask, setCreateTask] = useState<{ columnId: string } | null>(null);
  const [editBoard, setEditBoard] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);
  const [editColumn, setEditColumn] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);

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
      <UpdateBoardModal
        boardId={boardId}
        defaultValues={{
          name: editBoard?.name!,
          description: editBoard?.description!
        }}
        open={editBoard !== null}
        onClose={() => setEditBoard(null)}
      />
      <DeleteBoardModal
        boardId={deleteBoardId!}
        open={deleteBoardId !== null}
        onClose={() => setDeleteBoardId(null)}
      />
      <CreateTaskModal
        columnId={createTask?.columnId}
        open={createTask !== null}
        onClose={() => setCreateTask(null)}
      />
      <CreateColumnModal boardId={boardId} open={isOpen} onClose={hideModal} />
      <UpdateColumnModal
        columnId={editColumn?.id}
        defaultValues={{
          name: editColumn?.name!,
          color: editColumn?.color!
        }}
        open={editColumn !== null}
        onClose={() => setEditColumn(null)}
      />
      <div className={styles.board}>
        <BoardHeader
          name={boardData.board.name}
          description={boardData.board.description}
          onEdit={() => {
            setEditBoard({
              id: boardId,
              name: boardData.board.name,
              description: boardData.board.description
            });
          }}
          onDelete={() => {
            setDeleteBoardId(boardData.board.id);
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
                setEditColumn({
                  id: column.id,
                  name: column.name,
                  color: column.color
                });
              }}
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
