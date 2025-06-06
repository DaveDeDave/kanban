import { ReactQueryOptions, trpc } from "@/config/trpc.config";
import { useNavigate } from "@tanstack/react-router";
import { BOARDS_PER_PAGE } from "./getBoards.hook";

export const useCreateBoard = (opts?: ReactQueryOptions["board"]["createBoard"]) => {
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  return trpc.board.createBoard.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoards.setInfiniteData(
        {
          limit: BOARDS_PER_PAGE
        },
        (oldData) =>
          oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  boards: page.boards.concat({
                    ...response.createdBoard
                  })
                }))
              }
            : undefined
      );

      navigate({
        to: `/app/boards/${response.createdBoard.id}`
      });
    }
  });
};
