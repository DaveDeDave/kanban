import { BoardList } from "@/organisms/board-list";
import { Outlet } from "@tanstack/react-router";
import { FC } from "react";
import styles from "./boards-structure.module.scss";

export const BoardsStructure: FC = () => {
  return (
    <div className={styles.boardsStructure}>
      <BoardList
        // TODO: remove boards mock
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
