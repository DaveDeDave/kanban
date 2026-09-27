import { authProcedure } from "@/trpc/procedures";
import { taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.string()
    })
  )
  .output(
    z.object({
      deletedTask: taskSchema.extend({
        boardId: z.string()
      })
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.task.deleteTask(input.taskId, ctx.user.id));
