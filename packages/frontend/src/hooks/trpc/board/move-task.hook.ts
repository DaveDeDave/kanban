import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useMoveTask = (
  state: { boardId: string },
  opts?: ReactQueryOptions["task"]["moveTask"]
) => {
  const utils = trpc.useUtils();

  const { boardId } = state;

  return trpc.task.moveTask.useMutation({
    ...opts,
    onMutate: (input) => {
      opts?.onMutate?.(input);

      utils.board.getBoardById.setData({ boardId }, (oldData) =>
        oldData
          ? {
              ...oldData,
              board: {
                ...oldData.board,
                columns: oldData.board.columns.map((column) => {
                  if (column.id === input.fromColumnId) {
                    return {
                      ...column,
                      tasks: column.tasks.filter((task) => task.id !== input.taskId)
                    };
                  }

                  if (column.id === input.toColumnId) {
                    const task = oldData.board.columns
                      .find((column) => column.id === input.fromColumnId)
                      ?.tasks.find((task) => task.id === input.taskId);

                    const position = input.tasksOrder.findIndex(
                      (task) => task.taskId === input.taskId
                    );

                    const tasks = column.tasks;

                    if (task && tasks.length === 0) {
                      tasks.push(task);
                    } else if (task && position > 0) {
                      tasks.splice(position, 0, task);
                    }

                    return {
                      ...column,
                      tasks
                    };
                  }

                  return column;
                })
              }
            }
          : undefined
      );
    },
    onSettled: (response, error, input, ctx) => {
      opts?.onSettled?.(response, error, input, ctx);

      utils.task.getTasksByColumn.invalidate({
        columnId: input.toColumnId
      });
      utils.board.getBoardById.invalidate({
        boardId
      });
    }
  });
};
