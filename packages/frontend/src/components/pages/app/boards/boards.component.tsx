import { FC } from "react";
import styles from "./boards.module.scss";
import { BoardList } from "./components/board-list";

export const Component: FC = () => {
  return (
    <div className={styles.boards}>
      <BoardList />
    </div>
  );
};
