import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useCreateColumn = (opts?: ReactQueryOptions["column"]["createColumn"]) => {
  const utils = trpc.useUtils();

  return trpc.column.createColumn.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);
      utils.board.getBoardById.invalidate({
        boardId: variables.boardId
      });
      utils.column.getColumnsByBoard.invalidate({
        boardId: variables.boardId
      });
    }
  });
};
