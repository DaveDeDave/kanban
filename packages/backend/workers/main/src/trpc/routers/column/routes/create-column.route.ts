import { authProcedure } from "@/trpc/procedures";
import { columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      name: z.string(),
      color: z.string(),
      boardId: z.string()
    })
  )
  .output(
    z.object({
      createdColumn: columnSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.column.createColumn(input, ctx.user.id));
