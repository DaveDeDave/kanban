import { BoardHeader } from "@/organisms/board-header";
import { useParams } from "@tanstack/react-router";
import { FC, useMemo } from "react";
import styles from "./board.module.scss";
import { KanbanColumn } from "@/organisms/kanban-column/kanban-column";
import { useGetBoard } from "@/hooks/trpc/board/getBoard.hook";
import { AddColumnButton } from "@/atoms/add-kanban-column-button";
import { BoardModals, useBoardModals } from "./modals";
import { useSharedSortable, useSortable } from "@/hooks/sortable.hooks";
import { useSortColumns } from "@/hooks/trpc/column/sort-columns.hook";
import { useSortTasks } from "@/hooks/trpc/board/sort-tasks.hook";
import { useMoveTask } from "@/hooks/trpc/board/move-task.hook";
import classNames from "classnames";
import { RiLoader4Fill } from "@remixicon/react";

const columnDragClassName = "column-handle";
const taskDragClassName = "task-handle";

export const Component: FC = () => {
  const { boardId } = useParams({
    from: "/app/boards/$boardId"
  });

  const boardModals = useBoardModals();

  const {
    data: boardData,
    isLoading,
    isRefetching,
    error
  } = useGetBoard({
    boardId
  });

  const sortColumns = useSortColumns();
  const sortTasks = useSortTasks({ boardId });
  const moveTask = useMoveTask({ boardId });

  const columnIds = useMemo(() => {
    if (!boardData?.board.columns) {
      return [];
    }

    return boardData.board.columns.map((column) => column.id);
  }, [boardData?.board.columns]);

  const numberOfTasks = useMemo(() => {
    if (!boardData) {
      return 0;
    }

    return boardData.board.columns.reduce(
      (totalTasks, column) => totalTasks + column.tasks.length,
      0
    );
  }, [boardData?.board.columns]);

  const taskIdsByColumn = useMemo(() => {
    if (!boardData?.board.columns) {
      return {};
    }

    return boardData.board.columns.reduce((tasksByColumn, column) => {
      tasksByColumn[column.id] = column.tasks.map((task) => task.id);
      return tasksByColumn;
    }, {} as Record<string, string[]>);
  }, [boardData?.board.columns]);

  const { listRef: columnListRef, loading: sortableLoading } = useSortable<HTMLDivElement>(
    columnIds,
    async (newItems) => {
      const columnsOrder = (newItems as string[]).map((columnId, order) => ({ columnId, order }));
      await sortColumns.mutateAsync({
        boardId: boardId!,
        columnsOrder
      });
    },
    {
      handle: columnDragClassName
    }
  );

  const { listsRef: taskListsRef, loading: sharedSortableLoading } =
    useSharedSortable<HTMLDivElement>(
      taskIdsByColumn,
      async (event) => {
        if (event.sort) {
          const tasksOrder = (event.sort.newItems as string[]).map((taskId, order) => ({
            taskId,
            order
          }));
          await sortTasks.mutateAsync({
            columnId: event.sort.list,
            tasksOrder
          });
        } else if (event.move) {
          const tasksOrder = (event.move.newItems as string[]).map((taskId, order) => ({
            taskId,
            order
          }));
          await moveTask.mutateAsync({
            fromColumnId: event.move.from,
            toColumnId: event.move.to,
            taskId: event.move.item,
            tasksOrder
          });
        }
      },
      {
        handle: taskDragClassName
      }
    );

  const setTaskListRef = (el: HTMLDivElement | null, key: string) => {
    if (el) {
      taskListsRef.current[key] = el;
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (error || !boardData) {
    return "TODO: handle errors (e.g. 404, 500)";
  }

  return (
    <>
      <BoardModals currentBoardId={boardId} {...boardModals} />
      <div className={styles.board}>
        <BoardHeader
          name={boardData.board.name}
          description={boardData.board.description}
          onUpdate={() => {
            boardModals.showUpdateBoardModal({
              id: boardId,
              name: boardData.board.name,
              description: boardData.board.description
            });
          }}
          onDelete={() => {
            boardModals.showDeleteBoardModal({
              id: boardData.board.id,
              name: boardData.board.name
            });
          }}
        />
        <div className={styles.columnsWrapper}>
          <div
            className={classNames(
              styles.loader,
              (isRefetching || sortableLoading || sharedSortableLoading) && styles.show
            )}
          >
            <span className={styles.loaderIcon}>
              <RiLoader4Fill />
            </span>
          </div>
          <div className={styles.columns} ref={columnListRef}>
            {boardData.board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                columnClassName={
                  boardData.board.columns.length > 1 ? columnDragClassName : undefined
                }
                taskDragClassname={numberOfTasks > 1 ? taskDragClassName : undefined}
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
