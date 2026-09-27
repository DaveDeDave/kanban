import { authProcedure } from "@/trpc/procedures";
import { taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      columnId: z.string()
    })
  )
  .output(
    z.object({
      createdTask: taskSchema.extend({
        boardId: z.string()
      })
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.task.createTask(input, ctx.user.id));
