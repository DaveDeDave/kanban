import { sql } from "drizzle-orm";
import { foreignKey, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { columns } from "./column.table";

export const tasks = pgTable(
  "Task",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description").notNull(),
    columnId: text("columnId").notNull(),
    rank: text("rank").notNull().default(""),
    createdAt: timestamp("createdAt", { precision: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date())
  },
  (table) => [
    index("Task_columnId_rank_createdAt_idx").on(table.columnId, table.rank, table.createdAt),
    foreignKey({
      name: "Task_columnId_fkey",
      columns: [table.columnId],
      foreignColumns: [columns.id]
    })
      .onDelete("cascade")
      .onUpdate("cascade")
  ]
);
