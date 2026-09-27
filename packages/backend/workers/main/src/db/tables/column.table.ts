import { sql } from "drizzle-orm";
import { foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { boards } from "./board.table";

export const columns = pgTable("Column", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  color: text("color").notNull(),
  boardId: text("boardId").notNull(),
  rank: text("rank").notNull().default(""),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date())
}, (table) => [foreignKey({ name: "Column_boardId_fkey", columns: [table.boardId], foreignColumns: [boards.id] }).onDelete("cascade").onUpdate("cascade")]);
