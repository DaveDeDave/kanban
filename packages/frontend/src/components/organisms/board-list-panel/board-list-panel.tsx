import { RouterOutputs } from "@/config/trpc.config";
import { FC } from "react";
import styles from "./board-list-panel.module.scss";
import { BoardList } from "@/molecules/board-list/board-list";
import { Collapsible } from "@/atoms/collapsible";
import { t } from "i18next";

interface BoardListPanelProps {
  boards: Pick<RouterOutputs["board"]["getBoards"]["boards"][number], "id" | "name" | "ownerId">[];
  activeBoardId: string;
  onChangeActiveBoard: (boardId: string) => void;
}

export const BoardListPanel: FC<BoardListPanelProps> = ({
  boards,
  activeBoardId,
  onChangeActiveBoard
}) => {
  return (
    <div className={styles.boardListPanelWrapper}>
      <Collapsible defaultOpen={true} title={t("components.organisms.boardListPanel.myBoards")}>
        <BoardList
          boards={boards}
          activeBoardId={activeBoardId}
          onChangeActiveBoard={onChangeActiveBoard}
        />
      </Collapsible>
    </div>
  );
};
