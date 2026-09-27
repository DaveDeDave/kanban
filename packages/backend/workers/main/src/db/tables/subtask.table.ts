import { sql } from "drizzle-orm";
import { boolean, foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { tasks } from "./task.table";

export const subtasks = pgTable(
  "Subtask",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    description: text("description").notNull(),
    completed: boolean("completed").notNull().default(false),
    taskId: text("taskId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date())
  },
  (table) => [
    foreignKey({ name: "Subtask_taskId_fkey", columns: [table.taskId], foreignColumns: [tasks.id] })
      .onDelete("cascade")
      .onUpdate("cascade")
  ]
);
