import { authProcedure } from "@/trpc/init";
import { TaskNotFoundException, subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      description: z.string(),
      taskId: z.number()
    })
  )
  .output(
    z.object({
      createdSubtask: subtaskSchema
    })
  )
  .mutation(async ({ input: { description, taskId }, ctx: { prisma, user } }) => {
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

    const createdSubtask = await prisma.subtask.create({
      data: {
        description,
        taskId
      }
    });

    return { createdSubtask };
  });
