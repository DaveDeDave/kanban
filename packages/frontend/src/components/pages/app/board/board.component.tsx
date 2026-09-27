import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC, useMemo, useRef, useState } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";
import { AddColumnButton } from "@/atoms/add-kanban-column-button";
import { Button } from "@/atoms/button";
import { BoardModals, useBoardModals } from "./modals";
import { useSharedSortable, useSortable } from "@/hooks/sortable.hooks";
import { useColumnMoveQueue } from "@/hooks/use-column-move-queue.hooks";
import { useTaskMoveQueue } from "@/hooks/use-task-move-queue.hooks";
import type { TaskMove } from "@/utils/task-move.utils";
import type { ColumnMove } from "@/utils/column-move.utils";
import type { RouterOutputs } from "@/config/trpc.config";
import type { BoardSyncActivity } from "@/utils/board-sync.utils";
import { t } from "i18next";

const columnDragClassName = "column-handle";
const taskDragClassName = "task-handle";
type Board = RouterOutputs["board"]["getBoardById"]["board"];

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  return <BoardView key={boardId} boardId={boardId} />;
};

const BoardView: FC<{ boardId: string }> = ({ boardId }) => {
  const boardModals = useBoardModals();
  const syncActivity = useRef<BoardSyncActivity>({ taskQueue: false, columnQueue: false });

  const {
    data: boardData,
    isLoading,
    refetch
  } = useGetBoard({
    boardId
  });

  const {
    visibleBoard: columnProjectedBoard,
    moveError: columnMoveError,
    syncBlocked: columnSyncBlocked,
    enqueue: enqueueColumn,
    retryLoad: retryColumns
  } = useColumnMoveQueue(boardId, boardData?.board, refetch, syncActivity);
  const {
    visibleBoard: projectedBoard,
    moveError: taskMoveError,
    syncBlocked: taskSyncBlocked,
    enqueue: enqueueTask,
    retryLoad: retryTasks
  } = useTaskMoveQueue(boardId, columnProjectedBoard, refetch, syncActivity);
  const [taskDragging, setTaskDragging] = useState(false);
  const [columnDragging, setColumnDragging] = useState(false);
  const columnDragDisabled = !columnDragging && columnSyncBlocked;
  const taskDragDisabled = !taskDragging && taskSyncBlocked;
  const taskDragBoard = useRef<Board | undefined>(undefined);
  const columnDragBoard = useRef<Board | undefined>(undefined);
  const visibleBoard = taskDragging
    ? taskDragBoard.current
    : columnDragging
    ? columnDragBoard.current
    : projectedBoard;

  const columnIds = useMemo(() => {
    if (!visibleBoard) {
      return [];
    }

    return visibleBoard.columns.map((column) => column.id);
  }, [visibleBoard]);

  const numberOfTasks = useMemo(() => {
    if (!visibleBoard) {
      return 0;
    }

    return visibleBoard.columns.reduce((totalTasks, column) => totalTasks + column.tasks.length, 0);
  }, [visibleBoard]);

  const taskIdsByColumn = useMemo(() => {
    if (!visibleBoard) {
      return {};
    }

    return visibleBoard.columns.reduce((tasksByColumn, column) => {
      tasksByColumn[column.id] = column.tasks.map((task) => task.id);
      return tasksByColumn;
    }, {} as Record<string, string[]>);
  }, [visibleBoard]);

  const { listRef: columnListRef } = useSortable<HTMLDivElement>(
    columnIds,
    (event) => {
      const move: ColumnMove = {
        columnId: event.itemId,
        previousColumnId: event.previousItemId,
        nextColumnId: event.nextItemId
      };
      enqueueColumn(move);
    },
    {
      handle: columnDragClassName,
      disabled: columnDragDisabled
    },
    {
      onStart: () => {
        columnDragBoard.current = visibleBoard;
        setColumnDragging(true);
      },
      onEnd: () => setColumnDragging(false)
    }
  );

  const { listsRef: taskListsRef } = useSharedSortable<HTMLDivElement>(
    taskIdsByColumn,
    (event) => {
      if (!visibleBoard) return;
      const sourceTasks = visibleBoard.columns.find(({ id }) => id === event.listId)?.tasks;
      const oldIndex = sourceTasks?.findIndex(({ id }) => id === event.itemId) ?? -1;
      if (!sourceTasks || oldIndex < 0) return;

      const move: TaskMove = {
        taskId: event.itemId,
        targetColumnId: event.newListId ?? event.listId,
        previousTaskId: event.previousItemId,
        nextTaskId: event.nextItemId
      };
      enqueueTask(move);
    },
    {
      handle: taskDragClassName,
      disabled: taskDragDisabled
    },
    {
      onStart: () => {
        taskDragBoard.current = visibleBoard;
        setTaskDragging(true);
      },
      onEnd: () => setTaskDragging(false)
    }
  );

  const setTaskListRef = (el: HTMLDivElement | null, key: string) => {
    if (el) {
      taskListsRef.current[key] = el;
    } else {
      delete taskListsRef.current[key];
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (!boardData || !visibleBoard) {
    return "TODO: handle errors (e.g. 404, 500)";
  }

  return (
    <>
      <BoardModals currentBoardId={boardId} {...boardModals} />
      <div className={styles.board}>
        <BoardHeader
          name={visibleBoard.name}
          description={visibleBoard.description}
          onUpdate={() => {
            boardModals.showUpdateBoardModal({
              id: boardId,
              name: visibleBoard.name,
              description: visibleBoard.description
            });
          }}
          onDelete={() => {
            boardModals.showDeleteBoardModal({
              id: visibleBoard.id,
              name: visibleBoard.name
            });
          }}
        />
        {taskMoveError && (
          <div className={styles.moveError} role="alert">
            {t("pages.board.moveError")}
            <Button
              type="button"
              variant="secondary"
              label={t("pages.board.retryLoad")}
              onClick={retryTasks}
            />
          </div>
        )}
        {columnMoveError && (
          <div className={styles.moveError} role="alert">
            {t("pages.board.columnMoveError")}
            <Button
              type="button"
              variant="secondary"
              label={t("pages.board.retryLoad")}
              onClick={retryColumns}
            />
          </div>
        )}
        <div className={styles.columnsWrapper}>
          <div className={styles.columns} ref={columnListRef}>
            {visibleBoard.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                columnClassName={visibleBoard.columns.length > 1 ? columnDragClassName : undefined}
                taskDragClassname={numberOfTasks > 0 ? taskDragClassName : undefined}
                taskListRef={(el) => setTaskListRef(el, column.id)}
                head={{
                  title: column.name,
                  color: column.color
                }}
                tasks={column.tasks}
                onUpdate={() => {
                  boardModals.showUpdateColumnModal({
                    id: column.id,
                    name: column.name,
                    color: column.color
                  });
                }}
                onDelete={() => {
                  boardModals.showDeleteColumnModal({
                    id: column.id,
                    name: column.name
                  });
                }}
                onAddTask={() => {
                  boardModals.showCreateTaskModal({
                    columnId: column.id
                  });
                }}
                onUpdateTask={(task) => {
                  boardModals.showUpdateTaskModal(task);
                }}
                onDeleteTask={(task) => {
                  boardModals.showDeleteTaskModal({
                    id: task.id,
                    title: task.title
                  });
                }}
              />
            ))}
          </div>
          <AddColumnButton onClick={boardModals.showCreateColumnModal} />
        </div>
      </div>
    </>
  );
};
