import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useCreateTask = (opts?: ReactQueryOptions["task"]["createTask"]) => {
  const utils = trpc.useUtils();

  return trpc.task.createTask.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);
      utils.board.getBoardById.invalidate({
        boardId: response.createdTask.boardId
      });
      utils.task.getTasksByColumn.invalidate({
        columnId: response.createdTask.columnId
      });
    }
  });
};
