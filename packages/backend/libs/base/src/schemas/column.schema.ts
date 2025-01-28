import { z } from "zod";
import { taskSchema } from "./task.schema";

export const columnSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  boardId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const populatedColumnSchema = columnSchema.extend({
  tasks: z.array(taskSchema)
});
