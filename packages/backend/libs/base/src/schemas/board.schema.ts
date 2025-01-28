import { z } from "zod";
import { populatedColumnSchema } from "./column.schema";

export const boardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const populatedBoardSchema = boardSchema.extend({
  columns: z.array(populatedColumnSchema)
});
