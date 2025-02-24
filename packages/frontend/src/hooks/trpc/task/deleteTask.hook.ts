import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useDeleteTask = (opts?: ReactQueryOptions["task"]["deleteTask"]) => {
  const utils = trpc.useUtils();

  return trpc.task.deleteTask.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoardById.setData(
        {
          boardId: response.deletedTask.boardId
        },
        (oldData) =>
          oldData
            ? {
                board: {
                  ...oldData.board,
                  columns: oldData.board.columns.map((column) => {
                    if (column.id !== response.deletedTask.columnId) {
                      return column;
                    }

                    return {
                      ...column,
                      tasks: column.tasks.filter((task) => task.id !== response.deletedTask.id)
                    };
                  })
                }
              }
            : undefined
      );

      utils.task.getTasksByColumn.setData(
        {
          columnId: response.deletedTask.columnId
        },
        (oldData) =>
          oldData
            ? {
                tasks: oldData.tasks.filter((task) => task.id !== response.deletedTask.id)
              }
            : undefined
      );
    }
  });
};
