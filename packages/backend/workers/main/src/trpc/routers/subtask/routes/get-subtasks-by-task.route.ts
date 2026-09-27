import { authProcedure } from "@/trpc/procedures";
import { subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.string()
    })
  )
  .output(
    z.object({
      subtasks: z.array(subtaskSchema)
    })
  )
  .query(async ({ input, ctx }) =>
    ctx.services.subtask.getSubtasksByTask(input.taskId, ctx.user.id)
  );
