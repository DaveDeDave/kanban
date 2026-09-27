import { authProcedure } from "@/trpc/procedures";
import { taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string(),
      moveToColumnId: z.string().nullable().optional(),
      taskId: z.string(),
      previousTaskId: z.string().nullable(),
      nextTaskId: z.string().nullable()
    })
  )
  .output(
    z.object({
      columnId: z.string(),
      task: taskSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.task.rankTask(input, ctx.user.id));
