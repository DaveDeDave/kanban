import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useRankColumn = (opts?: ReactQueryOptions["column"]["rankColumn"]) => {
  const utils = trpc.useUtils();

  return trpc.column.rankColumn.useMutation({
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
