import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useMoveTask = (
  state: { boardId: string },
  opts?: ReactQueryOptions["task"]["moveTask"]
) => {
  const utils = trpc.useUtils();

  const { boardId } = state;

  return trpc.task.moveTask.useMutation({
    ...opts,
    onSettled: (response, error, input, ctx) => {
      opts?.onSettled?.(response, error, input, ctx);

      utils.task.getTasksByColumn.invalidate({
        columnId: input.toColumnId
      });
      utils.board.getBoardById.invalidate({
        boardId
      });
    }
  });
};
