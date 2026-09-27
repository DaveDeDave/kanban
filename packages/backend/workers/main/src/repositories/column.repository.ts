import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { boards, columns } from "@/db/tables";
import type { Executor } from "./types";

export class ColumnRepository {
  constructor(private readonly db: Executor) {}

  private owned(ownerId: string) {
    return inArray(
      columns.boardId,
      this.db.select({ id: boards.id }).from(boards).where(eq(boards.ownerId, ownerId))
    );
  }

  async findOneById(id: string) {
    return (await this.db.select().from(columns).where(eq(columns.id, id)).limit(1))[0] ?? null;
  }

  async findOneByIdOrThrow(id: string) {
    const column = await this.findOneById(id);
    if (!column) throw new Error("Column not found");
    return column;
  }

  async findOneByIdAndOwner(id: string, ownerId: string) {
    return (
      (
        await this.db
          .select()
          .from(columns)
          .where(and(eq(columns.id, id), this.owned(ownerId)))
          .limit(1)
      )[0] ?? null
    );
  }

  async findManyByBoard(boardId: string) {
    return this.db
      .select()
      .from(columns)
      .where(eq(columns.boardId, boardId))
      .orderBy(asc(columns.rank), asc(columns.createdAt));
  }

  async findManyByBoardAndOwner(boardId: string, ownerId: string) {
    return this.db
      .select()
      .from(columns)
      .where(and(eq(columns.boardId, boardId), this.owned(ownerId)))
      .orderBy(asc(columns.rank), asc(columns.createdAt));
  }

  async findLastByBoard(boardId: string) {
    return (
      (
        await this.db
          .select()
          .from(columns)
          .where(eq(columns.boardId, boardId))
          .orderBy(desc(columns.rank))
          .limit(1)
      )[0] ?? null
    );
  }

  async create(data: typeof columns.$inferInsert) {
    return (await this.db.insert(columns).values(data).returning())[0];
  }

  async createMany(data: typeof columns.$inferInsert[]) {
    if (data.length) await this.db.insert(columns).values(data);
  }

  async updateByIdAndOwner(
    id: string,
    ownerId: string,
    data: Partial<typeof columns.$inferInsert>
  ) {
    return (
      (
        await this.db
          .update(columns)
          .set(data)
          .where(and(eq(columns.id, id), this.owned(ownerId)))
          .returning()
      )[0] ?? null
    );
  }

  async updateRank(id: string, boardId: string, rank: string) {
    return (
      (
        await this.db
          .update(columns)
          .set({ rank })
          .where(and(eq(columns.id, id), eq(columns.boardId, boardId)))
          .returning()
      )[0] ?? null
    );
  }

  async deleteByIdAndOwner(id: string, ownerId: string) {
    return (
      (
        await this.db
          .delete(columns)
          .where(and(eq(columns.id, id), this.owned(ownerId)))
          .returning()
      )[0] ?? null
    );
  }
}
