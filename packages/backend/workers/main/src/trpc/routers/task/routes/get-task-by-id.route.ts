import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException, populatedTaskSchema } from "@kanban/base-lib";
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
        subtasks: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!task) {
      throw new HttpNotFoundException({
        errorCode: "TaskNotFound"
      });
    }

    return {
      task
    };
  });
