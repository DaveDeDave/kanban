import { z } from "zod";

export const subtaskSchema = z.object({
  id: z.number(),
  description: z.string(),
  completed: z.boolean(),
  taskId: z.number()
});
