import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";
import { AddColumnButton } from "@/atoms/add-kanban-column-button";
import { Button } from "@/atoms/button";
import { BoardModals, useBoardModals } from "./modals";
import { useSharedSortable, useSortable } from "@/hooks/sortable.hooks";
import { useRankColumn } from "@/hooks/trpc/column/rank-column.hook";
import { useRankTask } from "@/hooks/trpc/board/rank-task.hook";
import classNames from "classnames";
import { RiLoader4Fill } from "@remixicon/react";
import { projectTaskMove, TaskMove } from "@/utils/task-move.utils";
import { t } from "i18next";

const columnDragClassName = "column-handle";
const taskDragClassName = "task-handle";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  const boardModals = useBoardModals();
  const [pendingMove, setPendingMove] = useState<TaskMove | null>(null);
  const [confirmedTask, setConfirmedTask] = useState<{
    id: string;
    columnId: string;
    rank: string;
  } | null>(null);
  const [moveError, setMoveError] = useState(false);
  const moveLocked = useRef(false);

  const {
    data: boardData,
    isLoading,
    refetch
  } = useGetBoard({
    boardId
  });

  const rankColumn = useRankColumn();
  const rankTask = useRankTask({ boardId });
  const visibleBoard = useMemo(
    () =>
      boardData && pendingMove ? projectTaskMove(boardData.board, pendingMove) : boardData?.board,
    [boardData, pendingMove]
  );

  useEffect(() => {
    if (!confirmedTask || !boardData) return;
    const task = boardData.board.columns
      .flatMap((column) => column.tasks)
      .find(({ id }) => id === confirmedTask.id);
    if (!task || (task.columnId === confirmedTask.columnId && task.rank === confirmedTask.rank)) {
      setPendingMove(null);
      setConfirmedTask(null);
      moveLocked.current = false;
    }
  }, [boardData, confirmedTask]);

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

  const { listRef: columnListRef, loading: sortableLoading } = useSortable<HTMLDivElement>(
    columnIds,
    async (event) => {
      await rankColumn.mutateAsync({
        boardId: boardId!,
        columnId: event.itemId,
        previousColumnId: event.previousItemId,
        nextColumnId: event.nextItemId
      });
    },
    {
      handle: columnDragClassName,
      disabled: Boolean(pendingMove)
    }
  );

  const { listsRef: taskListsRef } = useSharedSortable<HTMLDivElement>(
    taskIdsByColumn,
    async (event) => {
      if (moveLocked.current || !visibleBoard) return;
      const sourceTasks = visibleBoard.columns.find(({ id }) => id === event.listId)?.tasks;
      const oldIndex = sourceTasks?.findIndex(({ id }) => id === event.itemId) ?? -1;
      if (!sourceTasks || oldIndex < 0) return;

      const move: TaskMove = {
        taskId: event.itemId,
        targetColumnId: event.newListId ?? event.listId,
        previousTaskId: event.previousItemId,
        nextTaskId: event.nextItemId
      };
      const rollback: TaskMove = {
        taskId: event.itemId,
        targetColumnId: event.listId,
        previousTaskId: sourceTasks[oldIndex - 1]?.id ?? null,
        nextTaskId: sourceTasks[oldIndex + 1]?.id ?? null
      };

      moveLocked.current = true;
      flushSync(() => {
        setMoveError(false);
        setPendingMove(move);
      });
      try {
        const response = await rankTask.mutateAsync({
          columnId: event.listId,
          moveToColumnId: event.newListId,
          taskId: event.itemId,
          previousTaskId: event.previousItemId,
          nextTaskId: event.nextItemId
        });
        setConfirmedTask({
          id: response.task.id,
          columnId: response.task.columnId,
          rank: response.task.rank
        });
      } catch {
        flushSync(() => {
          setPendingMove(rollback);
          setMoveError(true);
        });
        const refreshed = await refetch();
        if (!refreshed.isError) {
          setPendingMove(null);
          moveLocked.current = false;
        }
      }
    },
    {
      handle: taskDragClassName,
      disabled: Boolean(pendingMove || sortableLoading)
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
        {moveError && (
          <div className={styles.moveError} role="alert">
            {t("pages.board.moveError")}
            {pendingMove && (
              <Button
                type="button"
                variant="secondary"
                label={t("pages.board.retryLoad")}
                onClick={async () => {
                  const refreshed = await refetch();
                  if (!refreshed.isError) {
                    setPendingMove(null);
                    moveLocked.current = false;
                  }
                }}
              />
            )}
          </div>
        )}
        <div className={styles.columnsWrapper}>
          <div className={classNames(styles.loader, sortableLoading && styles.show)}>
            <span className={styles.loaderIcon}>
              <RiLoader4Fill />
            </span>
          </div>
          <div className={styles.columns} ref={columnListRef}>
            {visibleBoard.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                columnClassName={visibleBoard.columns.length > 1 ? columnDragClassName : undefined}
                taskDragClassname={numberOfTasks > 1 ? taskDragClassName : undefined}
                columnDragDisabled={Boolean(pendingMove)}
                taskDragDisabled={Boolean(pendingMove || sortableLoading)}
                dimmedTaskId={pendingMove?.taskId}
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
