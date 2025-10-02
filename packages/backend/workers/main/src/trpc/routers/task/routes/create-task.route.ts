import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException, taskSchema } from "@kanban/base-lib";
import { LexoRank } from "lexorank";
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

    const firstTask = await prisma.task.findFirst({
      where: {
        columnId
      },
      orderBy: {
        rank: "asc"
      }
    });

    let rank: string;
    if (firstTask) {
      const firstTaskRank = LexoRank.parse(firstTask.rank);
      rank = firstTaskRank.genPrev().toString();
    } else {
      rank = LexoRank.middle().toString();
    }

    // TODO: handle rebalancing ranks when necessary

    const createdTask = await prisma.task.create({
      data: {
        title,
        description,
        columnId,
        rank
      }
    });

    return {
      createdTask: {
        ...createdTask,
        boardId: column.boardId
      }
    };
  });
