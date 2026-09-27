import { and, asc, eq, inArray } from "drizzle-orm";
import { boards, columns, subtasks, tasks } from "@/db/tables";
import type { Executor } from "./types";

export class SubtaskRepository {
  constructor(private readonly db: Executor) {}

  private owned(ownerId: string) {
    return inArray(
      subtasks.taskId,
      this.db
        .select({ id: tasks.id })
        .from(tasks)
        .innerJoin(columns, eq(columns.id, tasks.columnId))
        .innerJoin(boards, eq(boards.id, columns.boardId))
        .where(eq(boards.ownerId, ownerId))
    );
  }

  async findOneById(id: string) {
    return (await this.db.select().from(subtasks).where(eq(subtasks.id, id)).limit(1))[0] ?? null;
  }

  async findOneByIdAndOwner(id: string, ownerId: string) {
    return (
      (
        await this.db
          .select()
          .from(subtasks)
          .where(and(eq(subtasks.id, id), this.owned(ownerId)))
          .limit(1)
      )[0] ?? null
    );
  }

  async findManyByTask(taskId: string) {
    return this.db
      .select()
      .from(subtasks)
      .where(eq(subtasks.taskId, taskId))
      .orderBy(asc(subtasks.createdAt));
  }

  async findManyByTaskAndOwner(taskId: string, ownerId: string) {
    return this.db
      .select()
      .from(subtasks)
      .where(and(eq(subtasks.taskId, taskId), this.owned(ownerId)))
      .orderBy(asc(subtasks.createdAt));
  }

  async create(data: typeof subtasks.$inferInsert) {
    return (await this.db.insert(subtasks).values(data).returning())[0];
  }

  async createMany(data: typeof subtasks.$inferInsert[]) {
    if (data.length) await this.db.insert(subtasks).values(data);
  }

  async updateByIdAndOwner(
    id: string,
    ownerId: string,
    data: Partial<typeof subtasks.$inferInsert>
  ) {
    return (
      (
        await this.db
          .update(subtasks)
          .set(data)
          .where(and(eq(subtasks.id, id), this.owned(ownerId)))
          .returning()
      )[0] ?? null
    );
  }

  async deleteByIdAndOwner(id: string, ownerId: string) {
    return (
      (
        await this.db
          .delete(subtasks)
          .where(and(eq(subtasks.id, id), this.owned(ownerId)))
          .returning()
      )[0] ?? null
    );
  }
}
