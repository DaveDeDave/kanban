import { authProcedure } from "@/trpc/procedures";
import { columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string()
    })
  )
  .output(
    z.object({
      columns: z.array(columnSchema)
    })
  )
  .query(async ({ input, ctx }) => ctx.services.column.getColumnsByBoard(input.boardId, ctx.user.id));
