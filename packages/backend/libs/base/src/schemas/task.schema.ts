import { z } from "zod";
import { subtaskSchema } from "./subtask.schema";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  columnId: z.string(),
  order: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const populatedTaskSchema = taskSchema.extend({
  subtasks: z.array(subtaskSchema)
});
