import { BoardListPanel } from "@/organisms/board-list-panel";
import { Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { FC, useEffect, useState } from "react";
import styles from "./boards-structure.module.scss";
import { useGetBoards } from "@/hooks/trpc/board/getBoards.hook";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { CreateBoardModal } from "@/molecules/modals/board-modals";
import { Button } from "@/atoms/button";
import { RiArrowLeftLine } from "@remixicon/react";
import classNames from "classnames";

export const BoardsStructure: FC = () => {
  const navigate = useNavigate();

  const [boardListOpen, setBoardListOpen] = useState(false);

  const { isOpen, showModal, hideModal } = useModal();

  const params = useParams({
    strict: false
  });
  const location = useLocation();

  useEffect(() => {
    setBoardListOpen(false);
  }, [location.pathname]);

  const { data: boardsData } = useGetBoards();

  return (
    <>
      <CreateBoardModal open={isOpen} onClose={hideModal} />
      <div className={styles.boardsStructure}>
        <BoardListPanel
          open={boardListOpen}
          onClose={() => {
            setBoardListOpen(false);
          }}
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
        <div className={styles.boardWrapper}>
          <div
            className={classNames(styles.overlay, boardListOpen && styles.visible)}
            onClick={() => setBoardListOpen(false)}
          />
          <div className={styles.actionBar}>
            <Button
              leftIcon={location.href === "/app/boards" ? undefined : <RiArrowLeftLine />}
              label={location.href === "/app/boards" ? "Show boards" : "Back to boards"}
              variant="ghost"
              onClick={() => setBoardListOpen(true)}
              style={{
                padding: 0
              }}
            />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};
