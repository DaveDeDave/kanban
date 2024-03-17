import { z } from "zod";
import { subtaskSchema } from "./subtask.schema";

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  columnId: z.number()
});

export const populatedTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  columnId: z.number(),
  subtasks: z.array(subtaskSchema)
});
