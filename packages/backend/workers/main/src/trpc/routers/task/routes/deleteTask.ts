import { authProcedure } from "@/trpc/init";
import { TaskNotFoundException, taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.number()
    })
  )
  .output(
    z.object({
      deletedTask: taskSchema
    })
  )
  .mutation(async ({ input: { taskId }, ctx: { prisma, user } }) => {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        column: {
          board: {
            ownerId: user.id
          }
        }
      }
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
        column: {
          board: {
            ownerId: user.id
          }
        }
      }
    });

    return { deletedTask };
  });
