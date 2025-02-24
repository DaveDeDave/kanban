import { authProcedure } from "@/trpc/procedures";
import { TaskNotFoundException, taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.string(),
      title: z.string().optional(),
      description: z.string().optional()
    })
  )
  .output(
    z.object({
      updatedTask: taskSchema.extend({
        boardId: z.string()
      })
    })
  )
  .mutation(async ({ input: { taskId, title, description }, ctx: { prisma, user } }) => {
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
        column: {
          select: {
            boardId: true
          }
        }
      }
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        column: {
          board: {
            ownerId: user.id
          }
        }
      },
      data: {
        title,
        description
      }
    });

    return {
      updatedTask: {
        ...updatedTask,
        boardId: task.column.boardId
      }
    };
  });
