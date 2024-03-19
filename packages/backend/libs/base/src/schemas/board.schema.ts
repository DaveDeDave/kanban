import { z } from "zod";
import { populatedColumnSchema } from "./column.schema";

export const boardSchema = z.object({
  id: z.string(),
  name: z.string(),
  ownerId: z.string()
});

export const populatedBoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  columns: z.array(populatedColumnSchema)
});
