import { ReactQueryOptions, RouterInputs, trpc } from "@/config/trpc.config";

export const useGetBoard = (
  input: RouterInputs["board"]["getBoardById"],
  opts?: ReactQueryOptions["board"]["getBoardById"]
) => {
  return trpc.board.getBoardById.useQuery(input, opts);
};
