import type { RouterOutputs } from "@/config/trpc.config";

type Board = RouterOutputs["board"]["getBoardById"]["board"];
type Column = Board["columns"][number];

export interface ColumnMove {
  columnId: string;
  previousColumnId: string | null;
  nextColumnId: string | null;
}

export const projectColumnMove = (board: Board, move: ColumnMove): Board => {
  const columns = board.columns.filter((column) => column.id !== move.columnId);
  const column = board.columns.find((column) => column.id === move.columnId);
  if (!column) return board;

  const nextIndex = move.nextColumnId
    ? columns.findIndex(({ id }) => id === move.nextColumnId)
    : -1;
  const previousIndex = move.previousColumnId
    ? columns.findIndex(({ id }) => id === move.previousColumnId)
    : -1;
  const insertAt = nextIndex >= 0 ? nextIndex : previousIndex >= 0 ? previousIndex + 1 : 0;
  columns.splice(insertAt, 0, column);
  return { ...board, columns };
};

export const confirmColumnMove = (
  board: Board,
  saved: Pick<Column, "id" | "rank" | "updatedAt">
): Board => ({
  ...board,
  columns: board.columns.map((column) =>
    column.id === saved.id
      ? {
          ...column,
          rank: saved.rank,
          updatedAt: column.updatedAt > saved.updatedAt ? column.updatedAt : saved.updatedAt
        }
      : column
  )
});

export const resolveColumnMove = (board: Board, move: ColumnMove) => {
  if (!board.columns.some(({ id }) => id === move.columnId)) return null;
  const columns = projectColumnMove(board, move).columns;
  const index = columns.findIndex(({ id }) => id === move.columnId);
  return {
    boardId: board.id,
    columnId: move.columnId,
    previousColumnId: columns[index - 1]?.id ?? null,
    nextColumnId: columns[index + 1]?.id ?? null
  };
};
