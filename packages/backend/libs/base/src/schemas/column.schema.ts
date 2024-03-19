import { z } from "zod";
import { taskSchema } from "./task.schema";

export const columnSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  boardId: z.string()
});

export const populatedColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  boardId: z.string(),
  tasks: z.array(taskSchema)
});
