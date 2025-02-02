import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useCreateColumn = (opts?: ReactQueryOptions["column"]["createColumn"]) => {
  const utils = trpc.useUtils();

  return trpc.column.createColumn.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoardById.setData(
        {
          boardId: variables.boardId
        },
        (oldData) =>
          oldData
            ? {
                board: {
                  ...oldData.board,
                  columns: oldData.board.columns.concat({
                    ...response.createdColumn,
                    tasks: []
                  })
                }
              }
            : undefined
      );

      utils.column.getColumnsByBoard.setData(
        {
          boardId: variables.boardId
        },
        (oldData) =>
          oldData
            ? {
                columns: oldData.columns.concat({
                  ...response.createdColumn
                })
              }
            : undefined
      );
    }
  });
};
