import { ReactQueryOptions, RouterOutputs, trpc } from "@/config/trpc.config";

const sortColumns = (
  columns:
    | RouterOutputs["column"]["getColumnsByBoard"]["columns"]
    | RouterOutputs["board"]["getBoardById"]["board"]["columns"]
) => {
  return columns.sort((columnA, columnB) => {
    // if (columnA.order === columnB.order) {
    //   return columnA.createdAt.localeCompare(columnB.createdAt);
    // }

    if (columnA.order === null) {
      return 1;
    }

    if (columnB.order === null) {
      return -1;
    }

    return columnA.order - columnB.order;
  });
};

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
