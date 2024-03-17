import { authProcedure } from "@/trpc/init";
import { ColumnNotFoundException, taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      columnId: z.number()
    })
  )
  .output(
    z.object({
      createdTask: taskSchema
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
      throw new ColumnNotFoundException();
    }

    const createdTask = await prisma.task.create({
      data: {
        title,
        description,
        columnId
      }
    });

    return { createdTask };
  });
