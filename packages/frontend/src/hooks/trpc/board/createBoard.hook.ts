import { ReactQueryOptions, trpc } from "@/config/trpc.config";
import { useNavigate } from "@tanstack/react-router";

export const useCreateBoard = (opts?: ReactQueryOptions["board"]["createBoard"]) => {
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  return trpc.board.createBoard.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoards.setData(undefined, (oldData) =>
        oldData
          ? {
              boards: oldData.boards.concat({
                ...response.createdBoard
              })
            }
          : undefined
      );

      navigate({
        to: `/app/boards/${response.createdBoard.id}`
      });
    }
  });
};
