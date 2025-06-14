import { DeleteBoardModal, UpdateBoardModal } from "@/molecules/modals/board-modals";
import { CreateColumnModal, UpdateColumnModal } from "@/molecules/modals/column-modals";
import { FC } from "react";
import { useBoardModals } from "./board-modals.hook";
import { DeleteColumnModal } from "@/molecules/modals/column-modals/delete-column-modal";
import { CreateTaskModal, DeleteTaskModal, UpdateTaskModal } from "@/molecules/modals/task-modals";

type BoardModalsProps = ReturnType<typeof useBoardModals> & {
  currentBoardId: string;
};

export const BoardModals: FC<BoardModalsProps> = ({
  currentBoardId,
  updateBoard,
  updateBoardModalIsOpen,
  hideUpdateBoardModal,
  deleteBoard,
  deleteBoardModalIsOpen,
  hideDeleteBoardModal,
  createColumnModalIsOpen,
  hideCreateColumnModal,
  updateColumn,
  updateColumnModalIsOpen,
  hideUpdateColumnModal,
  deleteColumn,
  deleteColumnModalIsOpen,
  hideDeleteColumnModal,
  createTask,
  createTaskModalIsOpen,
  hideCreateTaskModal,
  updateTask,
  updateTaskModalIsOpen,
  hideUpdateTaskModal,
  deleteTask,
  deleteTaskModalIsOpen,
  hideDeleteTaskModal
}) => {
  return (
    <>
      <UpdateBoardModal
        boardId={currentBoardId}
        defaultValues={updateBoard!}
        open={updateBoardModalIsOpen}
        onClose={hideUpdateBoardModal}
      />
      <DeleteBoardModal
        boardId={deleteBoard?.id}
        boardName={deleteBoard?.name}
        open={deleteBoardModalIsOpen}
        onClose={hideDeleteBoardModal}
      />
      <CreateColumnModal
        boardId={currentBoardId}
        open={createColumnModalIsOpen}
        onClose={hideCreateColumnModal}
      />
      <UpdateColumnModal
        columnId={updateColumn?.id}
        defaultValues={{
          name: updateColumn?.name ?? "",
          color: updateColumn?.color ?? ""
        }}
        open={updateColumnModalIsOpen}
        onClose={hideUpdateColumnModal}
      />
      <DeleteColumnModal
        columnId={deleteColumn?.id}
        columnName={deleteColumn?.name}
        open={deleteColumnModalIsOpen}
        onClose={hideDeleteColumnModal}
      />
      <CreateTaskModal
        columnId={createTask?.columnId}
        open={createTaskModalIsOpen}
        onClose={hideCreateTaskModal}
      />
      <UpdateTaskModal
        taskId={updateTask?.id}
        defaultValues={{
          title: updateTask?.title ?? "",
          description: updateTask?.description ?? ""
        }}
        open={updateTaskModalIsOpen}
        onClose={hideUpdateTaskModal}
      />
      <DeleteTaskModal
        taskId={deleteTask?.id}
        taskTitle={deleteTask?.title}
        open={deleteTaskModalIsOpen}
        onClose={hideDeleteTaskModal}
      />
    </>
  );
};
