import { ReactQueryOptions, trpc } from "@/config/trpc.config";
import { BOARDS_PER_PAGE } from "./getBoards.hook";

export const useUpdateBoard = (opts?: ReactQueryOptions["board"]["updateBoard"]) => {
  const utils = trpc.useUtils();

  return trpc.board.updateBoard.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoards.setInfiniteData({ limit: BOARDS_PER_PAGE }, (oldData) =>
        oldData
          ? {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                boards: page.boards.map((board) => {
                  if (board.id !== response.updatedBoard.id) {
                    return board;
                  }

                  return {
                    ...board,
                    ...response.updatedBoard
                  };
                })
              }))
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
