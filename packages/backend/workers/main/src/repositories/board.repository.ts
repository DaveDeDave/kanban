import { and, asc, eq, gt, gte, or, sql } from "drizzle-orm";
import { boards } from "@/db/tables";
import type { Executor } from "./types";

export class BoardRepository {
  constructor(private readonly db: Executor) {}

  async findOneById(id: string) {
    return (await this.db.select().from(boards).where(eq(boards.id, id)).limit(1))[0] ?? null;
  }

  async findOneByIdAndOwner(id: string, ownerId: string) {
    return (await this.db.select().from(boards).where(and(eq(boards.id, id), eq(boards.ownerId, ownerId))).limit(1))[0] ?? null;
  }

  async findManyByOwner(ownerId: string, limit: number, cursorId?: string | null) {
    let cursorCondition;
    if (cursorId) {
      const cursor = await this.findOneById(cursorId);
      if (!cursor) return [];
      cursorCondition = or(gt(boards.createdAt, cursor.createdAt), and(eq(boards.createdAt, cursor.createdAt), gte(boards.id, cursor.id)));
    }
    return this.db.select().from(boards).where(and(eq(boards.ownerId, ownerId), cursorCondition)).orderBy(asc(boards.createdAt), asc(boards.id)).limit(limit);
  }

  async create(data: typeof boards.$inferInsert) {
    return (await this.db.insert(boards).values(data).returning())[0];
  }

  async createMany(data: (typeof boards.$inferInsert)[]) {
    if (data.length) await this.db.insert(boards).values(data);
  }

  async updateByIdAndOwner(id: string, ownerId: string, data: Partial<typeof boards.$inferInsert>) {
    return (await this.db.update(boards).set(data).where(and(eq(boards.id, id), eq(boards.ownerId, ownerId))).returning())[0] ?? null;
  }

  async deleteByIdAndOwner(id: string, ownerId: string) {
    return (await this.db.delete(boards).where(and(eq(boards.id, id), eq(boards.ownerId, ownerId))).returning())[0] ?? null;
  }

  async lockById(id: string) {
    await this.db.execute(sql`SELECT id FROM "Board" WHERE id = ${id} FOR UPDATE`);
  }
}
