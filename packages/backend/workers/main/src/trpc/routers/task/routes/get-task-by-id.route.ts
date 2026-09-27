import { authProcedure } from "@/trpc/procedures";
import { populatedTaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.string()
    })
  )
  .output(
    z.object({
      task: populatedTaskSchema
    })
  )
  .query(async ({ input, ctx }) => ctx.services.task.getTaskById(input.taskId, ctx.user.id));
