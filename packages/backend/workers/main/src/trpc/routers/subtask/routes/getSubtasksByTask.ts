import { authProcedure } from "@/trpc/init";
import { subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.number()
    })
  )
  .output(
    z.object({
      subtasks: z.array(subtaskSchema)
    })
  )
  .query(async ({ input: { taskId }, ctx: { prisma, user } }) => {
    const subtasks = await prisma.subtask.findMany({
      where: {
        taskId,
        task: {
          column: {
            board: {
              ownerId: user.id
            }
          }
        }
      }
    });

    return {
      subtasks
    };
  });
