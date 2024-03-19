import { z } from "zod";

export const subtaskSchema = z.object({
  id: z.string(),
  description: z.string(),
  completed: z.boolean(),
  taskId: z.string()
});
