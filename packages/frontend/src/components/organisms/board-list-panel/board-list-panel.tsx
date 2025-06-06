import { RouterOutputs } from "@/config/trpc.config";
import { FC } from "react";
import styles from "./board-list-panel.module.scss";
import { BoardList } from "@/molecules/board-list/board-list";
import { Collapsible } from "@/atoms/collapsible";
import { t } from "i18next";
import { RiAddLine, RiCloseLine } from "@remixicon/react";
import classNames from "classnames";

interface BoardListPanelProps {
  boards: Pick<RouterOutputs["board"]["getBoards"]["boards"][number], "id" | "name" | "ownerId">[];
  activeBoardId: string;
  open?: boolean;
  isLoading?: boolean;
  isThereMore?: boolean;
  isLoadingMore?: boolean;
  loadMore?: () => void;
  onClose?: () => void;
  onChangeActiveBoard: (boardId: string) => void;
  onCreateBoard?: () => void;
}

export const BoardListPanel: FC<BoardListPanelProps> = ({
  boards,
  activeBoardId,
  open,
  isLoading,
  isThereMore,
  isLoadingMore,
  loadMore,
  onClose,
  onChangeActiveBoard,
  onCreateBoard
}) => {
  return (
    <div className={classNames(styles.boardListPanelWrapper, open && styles.open)}>
      <button className={styles.closeButton} onClick={onClose}>
        <RiCloseLine />
      </button>
      <Collapsible
        defaultOpen={true}
        title={t("components.organisms.boardListPanel.myBoards")}
        actions={
          onCreateBoard
            ? [
                {
                  icon: <RiAddLine />,
                  onClick: onCreateBoard
                }
              ]
            : undefined
        }
      >
        {/* TODO: add loading state */}
        {isLoading ? (
          ""
        ) : (
          <BoardList
            boards={boards}
            activeBoardId={activeBoardId}
            isThereMore={isThereMore}
            isLoadingMore={isLoadingMore}
            loadMore={loadMore}
            onChangeActiveBoard={(boardId) => {
              onChangeActiveBoard(boardId);
              onClose?.();
            }}
          />
        )}
      </Collapsible>
    </div>
  );
};
