import { authProcedure } from "@/trpc/procedures";
import { subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      description: z.string(),
      taskId: z.string()
    })
  )
  .output(
    z.object({
      createdSubtask: subtaskSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.subtask.createSubtask(input, ctx.user.id));
