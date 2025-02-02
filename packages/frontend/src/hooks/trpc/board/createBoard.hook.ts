import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useCreateBoard = (opts?: ReactQueryOptions["board"]["createBoard"]) => {
  const utils = trpc.useUtils();

  return trpc.board.createBoard.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);
      utils.board.getBoards.invalidate();
    }
  });
};
