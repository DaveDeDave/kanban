import { sql } from "drizzle-orm";
import { foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.table";

export const boards = pgTable(
  "Board",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description").notNull(),
    ownerId: text("ownerId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date())
  },
  (table) => [
    foreignKey({ name: "Board_ownerId_fkey", columns: [table.ownerId], foreignColumns: [users.id] })
      .onDelete("cascade")
      .onUpdate("cascade")
  ]
);
