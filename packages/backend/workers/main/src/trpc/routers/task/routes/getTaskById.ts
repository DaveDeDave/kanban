import { authProcedure } from "@/trpc/init";
import { TaskNotFoundException, populatedTaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.number()
    })
  )
  .output(
    z.object({
      task: populatedTaskSchema
    })
  )
  .query(async ({ input: { taskId }, ctx: { prisma, user } }) => {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        column: {
          board: {
            ownerId: user.id
          }
        }
      },
      include: {
        subtasks: true
      }
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    return {
      task
    };
  });
