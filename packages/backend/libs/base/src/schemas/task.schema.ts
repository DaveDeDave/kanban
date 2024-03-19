import { z } from "zod";
import { subtaskSchema } from "./subtask.schema";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  columnId: z.string()
});

export const populatedTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  columnId: z.string(),
  subtasks: z.array(subtaskSchema)
});
