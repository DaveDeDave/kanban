import { authProcedure } from "@/trpc/procedures";
import { subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      description: z.string().optional(),
      completed: z.boolean().optional(),
      subtaskId: z.string()
    })
  )
  .output(
    z.object({
      updatedSubtask: subtaskSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.subtask.updateSubtask(input, ctx.user.id));
