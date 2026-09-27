import { authProcedure } from "@/trpc/procedures";
import { subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      subtaskId: z.string()
    })
  )
  .output(
    z.object({
      deletedSubtask: subtaskSchema
    })
  )
  .mutation(async ({ input, ctx }) =>
    ctx.services.subtask.deleteSubtask(input.subtaskId, ctx.user.id)
  );
