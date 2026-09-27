import { and, asc, eq, gte, inArray, lte, notInArray } from "drizzle-orm";
import { boards, columns, tasks } from "@/db/tables";
import type { Executor } from "./types";

export class TaskRepository {
  constructor(private readonly db: Executor) {}

  private owned(ownerId: string) {
    return inArray(
      tasks.columnId,
      this.db
        .select({ id: columns.id })
        .from(columns)
        .innerJoin(boards, eq(boards.id, columns.boardId))
        .where(eq(boards.ownerId, ownerId))
    );
  }

  async findOneById(id: string) {
    return (await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1))[0] ?? null;
  }

  async findOneByIdOrThrow(id: string) {
    const task = await this.findOneById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }

  async findOneByIdAndOwner(id: string, ownerId: string) {
    return (
      (
        await this.db
          .select()
          .from(tasks)
          .where(and(eq(tasks.id, id), this.owned(ownerId)))
          .limit(1)
      )[0] ?? null
    );
  }

  async findOneByIdAndColumn(id: string, columnId: string) {
    return (
      (
        await this.db
          .select()
          .from(tasks)
          .where(and(eq(tasks.id, id), eq(tasks.columnId, columnId)))
          .limit(1)
      )[0] ?? null
    );
  }

  async findManyByColumn(columnId: string) {
    return this.db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, columnId))
      .orderBy(asc(tasks.rank), asc(tasks.createdAt));
  }

  async findManyByColumnAndOwner(columnId: string, ownerId: string) {
    return this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.columnId, columnId), this.owned(ownerId)))
      .orderBy(asc(tasks.rank), asc(tasks.createdAt));
  }

  async findFirstByColumn(columnId: string) {
    return (
      (
        await this.db
          .select()
          .from(tasks)
          .where(eq(tasks.columnId, columnId))
          .orderBy(asc(tasks.rank))
          .limit(1)
      )[0] ?? null
    );
  }

  async findNeighbors(columnId: string, ids: string[]) {
    if (!ids.length) return [];
    return this.db
      .select({ id: tasks.id, rank: tasks.rank })
      .from(tasks)
      .where(and(eq(tasks.columnId, columnId), inArray(tasks.id, ids)));
  }

  async findBetween(
    columnId: string,
    excludedIds: string[],
    previousRank?: string,
    nextRank?: string
  ) {
    return (
      (
        await this.db
          .select({ id: tasks.id })
          .from(tasks)
          .where(
            and(
              eq(tasks.columnId, columnId),
              notInArray(tasks.id, excludedIds),
              previousRank !== undefined ? gte(tasks.rank, previousRank) : undefined,
              nextRank !== undefined ? lte(tasks.rank, nextRank) : undefined
            )
          )
          .limit(1)
      )[0] ?? null
    );
  }

  async create(data: typeof tasks.$inferInsert) {
    return (await this.db.insert(tasks).values(data).returning())[0];
  }

  async createMany(data: typeof tasks.$inferInsert[]) {
    if (data.length) await this.db.insert(tasks).values(data);
  }

  async updateByIdAndOwner(id: string, ownerId: string, data: Partial<typeof tasks.$inferInsert>) {
    return (
      (
        await this.db
          .update(tasks)
          .set(data)
          .where(and(eq(tasks.id, id), this.owned(ownerId)))
          .returning()
      )[0] ?? null
    );
  }

  async updateByIdAndColumn(
    id: string,
    columnId: string,
    data: Partial<typeof tasks.$inferInsert>
  ) {
    return (
      (
        await this.db
          .update(tasks)
          .set(data)
          .where(and(eq(tasks.id, id), eq(tasks.columnId, columnId)))
          .returning()
      )[0] ?? null
    );
  }

  async deleteByIdAndOwner(id: string, ownerId: string) {
    return (
      (
        await this.db
          .delete(tasks)
          .where(and(eq(tasks.id, id), this.owned(ownerId)))
          .returning()
      )[0] ?? null
    );
  }
}
