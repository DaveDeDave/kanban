import { BoardListPanel } from "@/organisms/board-list-panel";
import { Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./boards-structure.module.scss";

export const BoardsStructure: FC = () => {
  const navigate = useNavigate();

  const params = useParams({
    strict: false
  });

  return (
    <div className={styles.boardsStructure}>
      <BoardListPanel
        // TODO: remove boards mock
        onChangeActiveBoard={(boardId) => {
          navigate({
            to: `/app/boards/${boardId}`
          });
        }}
        activeBoardId={params.boardId ?? ""}
        boards={[
          {
            id: "1",
            name: "Board 1",
            ownerId: "0"
          },
          {
            id: "2",
            name: "Board 2",
            ownerId: "0"
          },
          {
            id: "3",
            name: "Board 3",
            ownerId: "0"
          }
        ]}
      />
      <Outlet />
    </div>
  );
};
