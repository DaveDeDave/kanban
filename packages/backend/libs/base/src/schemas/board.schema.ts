import { z } from "zod";
import { populatedColumnSchema } from "./column.schema";

export const boardSchema = z.object({
  id: z.number(),
  name: z.string(),
  ownerId: z.number()
});

export const populatedBoardSchema = z.object({
  id: z.number(),
  name: z.string(),
  ownerId: z.number(),
  columns: z.array(populatedColumnSchema)
});
