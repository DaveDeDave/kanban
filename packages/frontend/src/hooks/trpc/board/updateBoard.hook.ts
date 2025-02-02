import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useUpdateBoard = (opts?: ReactQueryOptions["board"]["updateBoard"]) => {
  const utils = trpc.useUtils();

  return trpc.board.updateBoard.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoards.setData(undefined, (oldData) =>
        oldData
          ? {
              boards: oldData.boards.map((board) => {
                if (board.id !== response.updatedBoard.id) {
                  return board;
                }

                return {
                  ...board,
                  ...response.updatedBoard
                };
              })
            }
          : undefined
      );

      utils.board.getBoardById.setData(
        {
          boardId: response.updatedBoard.id
        },
        (oldData) =>
          oldData
            ? {
                board: {
                  ...oldData.board,
                  ...response.updatedBoard
                }
              }
            : undefined
      );
    }
  });
};
