import { authProcedure } from "@/trpc/procedures";
import { columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string(),
      columnId: z.string(),
      previousColumnId: z.string().nullable(),
      nextColumnId: z.string().nullable()
    })
  )
  .output(
    z.object({
      boardId: z.string(),
      column: columnSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.column.rankColumn(input, ctx.user.id));
