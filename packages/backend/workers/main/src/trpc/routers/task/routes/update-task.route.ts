import { authProcedure } from "@/trpc/procedures";
import { taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.string(),
      title: z.string().optional(),
      description: z.string().optional()
    })
  )
  .output(
    z.object({
      updatedTask: taskSchema.extend({
        boardId: z.string()
      })
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.task.updateTask(input, ctx.user.id));
