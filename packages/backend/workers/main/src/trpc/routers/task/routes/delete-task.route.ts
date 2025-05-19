import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException, taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      taskId: z.string()
    })
  )
  .output(
    z.object({
      deletedTask: taskSchema.extend({
        boardId: z.string()
      })
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
      throw new HttpNotFoundException({
        errorCode: "TaskNotFound"
      });
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

    return {
      deletedTask: {
        ...deletedTask,
        boardId: task.column.boardId
      }
    };
  });
