import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useUpdateColumn = (opts?: ReactQueryOptions["column"]["updateColumn"]) => {
  const utils = trpc.useUtils();

  return trpc.column.updateColumn.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoardById.setData(
        {
          boardId: response.updatedColumn.boardId
        },
        (oldData) =>
          oldData
            ? {
                board: {
                  ...oldData.board,
                  columns: oldData.board.columns.map((column) => {
                    if (column.id !== response.updatedColumn.id) {
                      return column;
                    }

                    return {
                      ...column,
                      ...response.updatedColumn
                    };
                  })
                }
              }
            : undefined
      );

      utils.column.getColumnsByBoard.setData(
        {
          boardId: response.updatedColumn.boardId
        },
        (oldData) =>
          oldData
            ? {
                columns: oldData.columns.map((column) => {
                  if (column.id !== response.updatedColumn.id) {
                    return column;
                  }

                  return {
                    ...column,
                    ...response.updatedColumn
                  };
                })
              }
            : undefined
      );
    }
  });
};
