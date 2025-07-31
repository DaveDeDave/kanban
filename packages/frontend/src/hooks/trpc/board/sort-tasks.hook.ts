import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useSortTasks = (
  state: { boardId: string },
  opts?: ReactQueryOptions["task"]["sortTasks"]
) => {
  const utils = trpc.useUtils();

  const { boardId } = state;

  return trpc.task.sortTasks.useMutation({
    ...opts,
    onSettled: (response, error, input, ctx) => {
      opts?.onSettled?.(response, error, input, ctx);

      utils.task.getTasksByColumn.invalidate({
        columnId: input.columnId
      });
      utils.board.getBoardById.invalidate({
        boardId
      });
    }
  });
};
