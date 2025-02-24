import { DeleteBoardModal, UpdateBoardModal } from "@/molecules/modals/board-modals";
import { CreateColumnModal, UpdateColumnModal } from "@/molecules/modals/column-modals";
import { FC } from "react";
import { useBoardModals } from "./board-modals.hook";
import { DeleteColumnModal } from "@/molecules/modals/column-modals/delete-column-modal";
import { CreateTaskModal, DeleteTaskModal } from "@/molecules/modals/task-modals";

type BoardModalsProps = ReturnType<typeof useBoardModals> & {
  currentBoardId: string;
};

export const BoardModals: FC<BoardModalsProps> = ({
  currentBoardId,
  editBoard,
  editBoardModalIsOpen,
  hideEditBoardModal,
  deleteBoardId,
  deleteBoardModalIsOpen,
  hideDeleteBoardModal,
  createColumnModalIsOpen,
  hideCreateColumnModal,
  editColumn,
  editColumnModalIsOpen,
  hideEditColumnModal,
  deleteColumnId,
  deleteColumnModalIsOpen,
  hideDeleteColumnModal,
  createTask,
  createTaskModalIsOpen,
  hideCreateTaskModal,
  deleteTaskId,
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
        boardId={deleteBoardId!}
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
          name: editColumn?.name!,
          color: editColumn?.color!
        }}
        open={editColumnModalIsOpen}
        onClose={hideEditColumnModal}
      />
      <DeleteColumnModal
        columnId={deleteColumnId!}
        open={deleteColumnModalIsOpen}
        onClose={hideDeleteColumnModal}
      />
      <CreateTaskModal
        columnId={createTask?.columnId}
        open={createTaskModalIsOpen}
        onClose={hideCreateTaskModal}
      />
      <DeleteTaskModal
        taskId={deleteTaskId!}
        open={deleteTaskModalIsOpen}
        onClose={hideDeleteTaskModal}
      />
    </>
  );
};
