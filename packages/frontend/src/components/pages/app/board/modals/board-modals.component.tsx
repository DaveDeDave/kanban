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
  editBoard,
  editBoardModalIsOpen,
  hideEditBoardModal,
  deleteBoard,
  deleteBoardModalIsOpen,
  hideDeleteBoardModal,
  createColumnModalIsOpen,
  hideCreateColumnModal,
  editColumn,
  editColumnModalIsOpen,
  hideEditColumnModal,
  deleteColumn,
  deleteColumnModalIsOpen,
  hideDeleteColumnModal,
  createTask,
  createTaskModalIsOpen,
  hideCreateTaskModal,
  editTask,
  editTaskModalIsOpen,
  hideEditTaskModal,
  deleteTask,
  deleteTaskModalIsOpen,
  hideDeleteTaskModal
}) => {
  return (
    <>
      <UpdateBoardModal
        boardId={currentBoardId}
        defaultValues={editBoard!}
        open={editBoardModalIsOpen}
        onClose={hideEditBoardModal}
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
        columnId={editColumn?.id}
        defaultValues={{
          name: editColumn?.name ?? "",
          color: editColumn?.color ?? ""
        }}
        open={editColumnModalIsOpen}
        onClose={hideEditColumnModal}
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
        taskId={editTask?.id}
        defaultValues={{
          title: editTask?.title ?? "",
          description: editTask?.description ?? ""
        }}
        open={editTaskModalIsOpen}
        onClose={hideEditTaskModal}
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
