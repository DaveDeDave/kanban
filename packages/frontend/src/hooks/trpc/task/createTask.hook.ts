import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useCreateTask = (opts?: ReactQueryOptions["task"]["createTask"]) => {
  const utils = trpc.useUtils();

  return trpc.task.createTask.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoardById.setData(
        {
          boardId: response.createdTask.boardId
        },
        (oldData) =>
          oldData
            ? {
                board: {
                  ...oldData.board,
                  columns: oldData.board.columns.map((column) => {
                    if (column.id !== response.createdTask.columnId) {
                      return column;
                    }

                    return {
                      ...column,
                      tasks: [{ ...response.createdTask }, ...column.tasks]
                    };
                  })
                }
              }
            : undefined
      );

      utils.task.getTasksByColumn.setData(
        {
          columnId: response.createdTask.columnId
        },
        (oldData) =>
          oldData
            ? {
                tasks: [{ ...response.createdTask }, ...oldData.tasks]
              }
            : undefined
      );
    }
  });
};
