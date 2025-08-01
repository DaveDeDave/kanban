import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useSortColumns = (opts?: ReactQueryOptions["column"]["sortColumns"]) => {
  const utils = trpc.useUtils();

  return trpc.column.sortColumns.useMutation({
    ...opts,
    onSettled: (response, error, input, ctx) => {
      opts?.onSettled?.(response, error, input, ctx);

      utils.column.getColumnsByBoard.invalidate({
        boardId: input.boardId
      });
      utils.board.getBoardById.invalidate({
        boardId: input.boardId
      });
    }
  });
};
