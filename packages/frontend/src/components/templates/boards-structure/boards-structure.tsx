import { BoardListPanel } from "@/organisms/board-list-panel";
import { Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { FC, useEffect, useMemo, useState } from "react";
import styles from "./boards-structure.module.scss";
import { useGetBoards } from "@/hooks/trpc/board/getBoards.hook";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { CreateBoardModal } from "@/molecules/modals/board-modals";
import { Breadcrumb, BreadcrumbProps } from "@/atoms/breadcrumb";
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

  const {
    flatData: boardsData,
    isLoading: isLoadingBoards,
    hasNextPage: hasMoreBoards,
    fetchNextPage: fetchMoreBoards,
    isFetchingNextPage: isLoadingMoreBoards
  } = useGetBoards();

  const handleBreadCrumbLinkClick = (pathname: string) => {
    navigate({
      to: pathname
    });
  };

  const breadCrumbLinks = useMemo<BreadcrumbProps["links"]>(() => {
    if (params.boardId && !boardsData) {
      return [];
    }

    if (!params.boardId) {
      return [
        {
          label: "Boards",
          pathname: "/app/boards"
        }
      ];
    }

    const activeBoard = boardsData?.boards.find((board) => board.id === params.boardId);

    return [
      {
        label: "Boards",
        pathname: "/app/boards"
      },
      {
        label: activeBoard?.name ?? ""
      }
    ];
  }, [boardsData, params.boardId]);

  return (
    <>
      <CreateBoardModal open={isOpen} onClose={hideModal} />
      <div className={styles.boardsStructure}>
        {params.boardId ? (
          <BoardListPanel
            open={boardListOpen}
            activeBoardId={params.boardId ?? ""}
            boards={boardsData?.boards ?? []}
            isLoading={isLoadingBoards}
            isThereMore={hasMoreBoards}
            isLoadingMore={isLoadingMoreBoards}
            loadMore={fetchMoreBoards}
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
          />
        ) : null}
        <div className={classNames(styles.boardWrapper, !params.boardId && styles.scrollable)}>
          <div className={styles.header}>
            <Breadcrumb links={breadCrumbLinks} onClickLink={handleBreadCrumbLinkClick} />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};
