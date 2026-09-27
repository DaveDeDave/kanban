import { HttpNotFoundException } from "@kanban/base-lib";
import { TRPCError } from "@trpc/server";
import { LexoRank } from "lexorank";
import { BoardRepository } from "@/repositories/board.repository";
import { ColumnRepository } from "@/repositories/column.repository";
import { UnitOfWork } from "@/repositories/unit-of-work";

export class ColumnService {
  constructor(private readonly boards: BoardRepository, private readonly columns: ColumnRepository, private readonly unitOfWork: UnitOfWork) {}

  async createColumn(input: { name: string; color: string; boardId: string }, ownerId: string) {
    if (!(await this.boards.findOneByIdAndOwner(input.boardId, ownerId))) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    return this.unitOfWork.transaction(async ({ board, column }) => {
      await board.lockById(input.boardId);
      const last = await column.findLastByBoard(input.boardId);
      const rank = last ? LexoRank.parse(last.rank).genNext().toString() : LexoRank.middle().toString();
      return { createdColumn: await column.create({ ...input, rank }) };
    });
  }

  async updateColumn(input: { columnId: string; name?: string; color?: string }, ownerId: string) {
    if (!(await this.columns.findOneByIdAndOwner(input.columnId, ownerId))) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
    const updatedColumn = await this.columns.updateByIdAndOwner(input.columnId, ownerId, { name: input.name, color: input.color });
    if (!updatedColumn) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
    return { updatedColumn };
  }

  async deleteColumn(columnId: string, ownerId: string) {
    const existing = await this.columns.findOneByIdAndOwner(columnId, ownerId);
    if (!existing) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
    return this.unitOfWork.transaction(async ({ board, column }) => {
      await board.lockById(existing.boardId);
      const deletedColumn = await column.deleteByIdAndOwner(columnId, ownerId);
      if (!deletedColumn) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
      return { deletedColumn };
    });
  }

  async getColumnsByBoard(boardId: string, ownerId: string) {
    return { columns: await this.columns.findManyByBoardAndOwner(boardId, ownerId) };
  }

  async rankColumn(input: { boardId: string; columnId: string; previousColumnId: string | null; nextColumnId: string | null }, ownerId: string) {
    const { boardId, columnId, previousColumnId, nextColumnId } = input;
    if (!(await this.boards.findOneByIdAndOwner(boardId, ownerId))) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    return this.unitOfWork.transaction(async ({ board, column }) => {
      await board.lockById(boardId);
      const ordered = await column.findManyByBoard(boardId);
      if (!ordered.some(({ id }) => id === columnId)) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
      const remaining = ordered.filter(({ id }) => id !== columnId);
      const previousIndex = previousColumnId ? remaining.findIndex(({ id }) => id === previousColumnId) : -1;
      const nextIndex = nextColumnId ? remaining.findIndex(({ id }) => id === nextColumnId) : -1;
      const validPosition = previousColumnId === null
        ? nextColumnId === null ? remaining.length === 0 : nextIndex === 0
        : nextColumnId === null ? previousIndex >= 0 && previousIndex === remaining.length - 1
        : previousIndex >= 0 && nextIndex === previousIndex + 1;
      if (!validPosition) throw new TRPCError({ code: "CONFLICT", message: "Column order has changed" });
      const previous = remaining[previousIndex];
      const next = remaining[nextIndex];
      let rank: string;
      try {
        if (previous && next) rank = LexoRank.parse(previous.rank).between(LexoRank.parse(next.rank)).toString();
        else if (previous) rank = LexoRank.parse(previous.rank).genNext().toString();
        else if (next) rank = LexoRank.parse(next.rank).genPrev().toString();
        else rank = LexoRank.middle().toString();
      } catch {
        throw new TRPCError({ code: "CONFLICT", message: "Column rank cannot be calculated" });
      }
      const updated = await column.updateRank(columnId, boardId, rank);
      if (!updated) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
      return { boardId, column: updated };
    });
  }
}
