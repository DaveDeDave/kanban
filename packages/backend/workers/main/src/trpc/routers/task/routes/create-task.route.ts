import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException, taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      columnId: z.string()
    })
  )
  .output(
    z.object({
      createdTask: taskSchema.extend({
        boardId: z.string()
      })
    })
  )
  .mutation(async ({ input: { title, description, columnId }, ctx: { prisma, user } }) => {
    const column = await prisma.column.findUnique({
      where: {
        id: columnId,
        board: {
          ownerId: user.id
        }
      }
    });

    if (!column) {
      throw new HttpNotFoundException({
        errorCode: "ColumnNotFound"
      });
    }

    const createdTask = await prisma.task.create({
      data: {
        title,
        description,
        columnId
      }
    });

    return {
      createdTask: {
        ...createdTask,
        boardId: column.boardId
      }
    };
  });
