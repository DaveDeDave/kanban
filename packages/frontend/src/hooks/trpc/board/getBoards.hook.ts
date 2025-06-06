import { trpc } from "@/config/trpc.config";
import { useMemo } from "react";

type GetBoardsInfiniteQueryOptions = Parameters<typeof trpc.board.getBoards.useInfiniteQuery>[1];

export const BOARDS_PER_PAGE = 20;

export const useGetBoards = (opts?: GetBoardsInfiniteQueryOptions) => {
  const response = trpc.board.getBoards.useInfiniteQuery(
    {
      limit: BOARDS_PER_PAGE
    },
    {
      ...opts,
      getNextPageParam: (lastPage) => lastPage.nextCursor
    }
  );

  const flatData = useMemo(() => {
    if (!response.data) {
      return;
    }

    const boards = response.data.pages.flatMap((page) => page.boards);

    return {
      boards
    };
  }, [response.data]);

  return {
    ...response,
    flatData
  };
};
