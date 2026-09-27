import { authProcedure } from "@/trpc/procedures";
import { columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string(),
      name: z.string().optional(),
      color: z.string().optional()
    })
  )
  .output(
    z.object({
      updatedColumn: columnSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.column.updateColumn(input, ctx.user.id));
