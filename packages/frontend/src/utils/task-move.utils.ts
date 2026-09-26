import type { RouterOutputs } from "@/config/trpc.config";

type Board = RouterOutputs["board"]["getBoardById"]["board"];
type Task = Board["columns"][number]["tasks"][number];

export interface TaskMove {
  taskId: string;
  targetColumnId: string;
  previousTaskId: string | null;
  nextTaskId: string | null;
}

export const projectTaskMove = (board: Board, move: TaskMove): Board => {
  const task = board.columns.flatMap((column) => column.tasks).find(({ id }) => id === move.taskId);
  if (!task || !board.columns.some(({ id }) => id === move.targetColumnId)) {
    return board;
  }

  return {
    ...board,
    columns: board.columns.map((column) => {
      const tasks = column.tasks.filter(({ id }) => id !== move.taskId);
      if (column.id !== move.targetColumnId) {
        return tasks.length === column.tasks.length ? column : { ...column, tasks };
      }

      const nextIndex = move.nextTaskId ? tasks.findIndex(({ id }) => id === move.nextTaskId) : -1;
      const previousIndex = move.previousTaskId
        ? tasks.findIndex(({ id }) => id === move.previousTaskId)
        : -1;
      const insertAt = nextIndex >= 0 ? nextIndex : previousIndex >= 0 ? previousIndex + 1 : 0;
      tasks.splice(insertAt, 0, { ...task, columnId: move.targetColumnId });
      return { ...column, tasks };
    })
  };
};

export const confirmTaskMove = (board: Board, task: Task): Board => ({
  ...board,
  columns: board.columns.map((column) => ({
    ...column,
    tasks: column.tasks.map((current) =>
      current.id === task.id
        ? {
            ...current,
            columnId: task.columnId,
            rank: task.rank,
            updatedAt: current.updatedAt > task.updatedAt ? current.updatedAt : task.updatedAt
          }
        : current
    )
  }))
});
