import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useUpdateTask = (opts?: ReactQueryOptions["task"]["updateTask"]) => {
  const utils = trpc.useUtils();

  return trpc.task.updateTask.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoardById.setData(
        {
          boardId: response.updatedTask.boardId
        },
        (oldData) =>
          oldData
            ? {
                board: {
                  ...oldData.board,
                  columns: oldData.board.columns.map((column) => {
                    if (column.id !== response.updatedTask.columnId) {
                      return column;
                    }

                    return {
                      ...column,
                      tasks: column.tasks.map((task) => {
                        if (task.id !== response.updatedTask.id) {
                          return task;
                        }

                        return response.updatedTask;
                      })
                    };
                  })
                }
              }
            : undefined
      );

      utils.task.getTasksByColumn.setData(
        {
          columnId: response.updatedTask.columnId
        },
        (oldData) =>
          oldData
            ? {
                tasks: oldData.tasks.map((task) => {
                  if (task.id !== response.updatedTask.id) {
                    return task;
                  }

                  return response.updatedTask;
                })
              }
            : undefined
      );
    }
  });
};
