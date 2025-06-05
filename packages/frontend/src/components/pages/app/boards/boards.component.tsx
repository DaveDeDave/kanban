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

  const [editBoard, setEditBoard] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);

  return (
    <div className={styles.boards}>
      <CreateBoardModal open={isCreateBoardModalOpen} onClose={hideCreateBoardModal} />
      <UpdateBoardModal
        boardId={editBoard?.id}
        defaultValues={editBoard!}
        open={editBoard !== null}
        onClose={() => setEditBoard(null)}
      />
      <DeleteBoardModal
        boardId={deleteBoardId!}
        open={deleteBoardId !== null}
        onClose={() => setDeleteBoardId(null)}
      />
      <BoardList
        onCreateBoard={showCreateBoardModal}
        onUpdateBoard={setEditBoard}
        onDeleteBoard={setDeleteBoardId}
      />
    </div>
  );
};
