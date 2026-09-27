import { eq } from "drizzle-orm";
import { users } from "@/db/tables";
import type { Executor } from "./types";

export class UserRepository {
  constructor(private readonly db: Executor) {}

  async findOneById(id: string) {
    return (await this.db.select().from(users).where(eq(users.id, id)).limit(1))[0] ?? null;
  }

  async findOneByEmail(email: string) {
    return (await this.db.select().from(users).where(eq(users.email, email)).limit(1))[0] ?? null;
  }

  async create(data: typeof users.$inferInsert) {
    return (await this.db.insert(users).values(data).returning())[0];
  }

  async createMany(data: typeof users.$inferInsert[]) {
    if (data.length) await this.db.insert(users).values(data);
  }

  async deleteById(id: string) {
    return (await this.db.delete(users).where(eq(users.id, id)).returning())[0] ?? null;
  }

  async deleteAll() {
    await this.db.delete(users);
  }
}
