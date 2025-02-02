import { BoardListPanel } from "@/organisms/board-list-panel";
import { Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./boards-structure.module.scss";
import { useGetBoards } from "@/hooks/trpc/board/getBoards.hook";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { CreateBoardModal } from "@/molecules/modals/board-modals";

export const BoardsStructure: FC = () => {
  const navigate = useNavigate();

  const { isOpen, showModal, hideModal } = useModal();

  const params = useParams({
    strict: false
  });

  const { data: boardsData } = useGetBoards();

  return (
    <>
      <CreateBoardModal open={isOpen} onClose={hideModal} />
      <div className={styles.boardsStructure}>
        <BoardListPanel
          onChangeActiveBoard={(boardId) => {
            navigate({
              to: `/app/boards/${boardId}`
            });
          }}
          onCreateBoard={() => {
            showModal();
          }}
          activeBoardId={params.boardId ?? ""}
          boards={boardsData?.boards ?? []}
        />
        <Outlet />
      </div>
    </>
  );
};
