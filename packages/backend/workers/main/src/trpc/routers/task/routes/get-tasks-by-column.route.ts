import { authProcedure } from "@/trpc/procedures";
import { taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string()
    })
  )
  .output(
    z.object({
      tasks: z.array(taskSchema)
    })
  )
  .query(async ({ input, ctx }) => ctx.services.task.getTasksByColumn(input.columnId, ctx.user.id));
