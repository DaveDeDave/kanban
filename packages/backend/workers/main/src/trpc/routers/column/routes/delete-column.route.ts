import { authProcedure } from "@/trpc/procedures";
import { columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string()
    })
  )
  .output(
    z.object({
      deletedColumn: columnSchema
    })
  )
  .mutation(async ({ input, ctx }) =>
    ctx.services.column.deleteColumn(input.columnId, ctx.user.id)
  );
