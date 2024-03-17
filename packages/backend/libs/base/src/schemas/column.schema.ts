import { z } from "zod";
import { taskSchema } from "./task.schema";

export const columnSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  boardId: z.number()
});

export const populatedColumnSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  boardId: z.number(),
  tasks: z.array(taskSchema)
});
