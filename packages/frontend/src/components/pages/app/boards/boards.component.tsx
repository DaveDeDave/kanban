import { FC, useState } from "react";
import styles from "./boards.module.scss";
import { BoardList } from "./components/board-list";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import {
  CreateBoardModal,
  DeleteBoardModal,
  UpdateBoardModal
} from "@/molecules/modals/board-modals";

export const Component: FC = () => {
  const {
    isOpen: isCreateBoardModalOpen,
    hideModal: hideCreateBoardModal,
    showModal: showCreateBoardModal
  } = useModal();

  const [updateBoard, setUpdateBoard] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [deleteBoard, setDeleteBoard] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className={styles.boards}>
      <CreateBoardModal open={isCreateBoardModalOpen} onClose={hideCreateBoardModal} />
      <UpdateBoardModal
        boardId={updateBoard?.id}
        defaultValues={updateBoard!}
        open={updateBoard !== null}
        onClose={() => setUpdateBoard(null)}
      />
      <DeleteBoardModal
        boardId={deleteBoard?.id}
        boardName={deleteBoard?.name}
        open={deleteBoard !== null}
        onClose={() => setDeleteBoard(null)}
      />
      <BoardList
        onCreateBoard={showCreateBoardModal}
        onUpdateBoard={setUpdateBoard}
        onDeleteBoard={setDeleteBoard}
      />
    </div>
  );
};
