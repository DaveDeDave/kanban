import { ReactQueryOptions, trpc } from "@/config/trpc.config";
import { useNavigate } from "@tanstack/react-router";

export const useDeleteBoard = (opts?: ReactQueryOptions["board"]["deleteBoard"]) => {
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  return trpc.board.deleteBoard.useMutation({
    ...opts,
    onSuccess: (response, variables, context) => {
      opts?.onSuccess?.(response, variables, context);

      utils.board.getBoards.setData(undefined, (oldData) =>
        oldData
          ? {
              boards: oldData.boards.filter((board) => board.id !== response.deletedBoard.id)
            }
          : undefined
      );

      utils.board.getBoardById.invalidate({
        boardId: response.deletedBoard.id
      });

      navigate({
        to: `/app/boards`
      });
    }
  });
};
