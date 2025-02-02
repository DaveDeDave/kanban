import { ReactQueryOptions, trpc } from "@/config/trpc.config";

export const useGetBoards = (opts?: ReactQueryOptions["board"]["getBoards"]) => {
  return trpc.board.getBoards.useQuery(undefined, opts);
};
