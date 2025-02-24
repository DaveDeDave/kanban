import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useDeleteColumn = (opts?: ReactQueryOptions["column"]["deleteColumn"]) => {
  const utils = trpc.useUtils();

  return trpc.column.deleteColumn.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoardById.setData(
        {
          boardId: response.deletedColumn.boardId
        },
        (oldData) =>
          oldData
            ? {
                ...oldData,
                board: {
                  ...oldData.board,
                  columns: oldData.board.columns.filter(
                    (column) => column.id !== response.deletedColumn.id
                  )
                }
              }
            : undefined
      );

      utils.column.getColumnsByBoard.setData(
        {
          boardId: response.deletedColumn.boardId
        },
        (oldData) =>
          oldData
            ? {
                ...oldData,
                columns: oldData.columns.filter((column) => column.id !== response.deletedColumn.id)
              }
            : undefined
      );
    }
  });
};
