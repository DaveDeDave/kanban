import { DeleteBoardModal, UpdateBoardModal } from "@/molecules/modals/board-modals";
import { CreateColumnModal, UpdateColumnModal } from "@/molecules/modals/column-modals";
import { CreateTaskModal } from "@/molecules/modals/create-task-modal";
import { FC } from "react";
import { useBoardModals } from "./board-modals.hook";

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
  createTask,
  createTaskModalIsOpen,
  hideCreateTaskModal
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
      <CreateTaskModal
        columnId={createTask?.columnId}
        open={createTaskModalIsOpen}
        onClose={hideCreateTaskModal}
      />
    </>
  );
};
