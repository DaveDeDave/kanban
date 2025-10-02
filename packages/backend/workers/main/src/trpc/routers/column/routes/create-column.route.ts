import { authProcedure } from "@/trpc/procedures";
import { columnSchema, HttpNotFoundException } from "@kanban/base-lib";
import { LexoRank } from "lexorank";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      name: z.string(),
      color: z.string(),
      boardId: z.string()
    })
  )
  .output(
    z.object({
      createdColumn: columnSchema
    })
  )
  .mutation(async ({ input: { name, color, boardId }, ctx: { prisma, user } }) => {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: user.id
      }
    });

    if (!board) {
      throw new HttpNotFoundException({
        errorCode: "BoardNotFound"
      });
    }

    const lastColumn = await prisma.column.findFirst({
      where: {
        boardId
      },
      orderBy: {
        rank: "desc"
      }
    });

    let rank: string;
    if (lastColumn) {
      const lastColumnRank = LexoRank.parse(lastColumn.rank);
      rank = lastColumnRank.genNext().toString();
    } else {
      rank = LexoRank.middle().toString();
    }

    // TODO: handle rebalancing ranks when necessary

    const createdColumn = await prisma.column.create({
      data: {
        name,
        color,
        boardId,
        rank
      }
    });

    return { createdColumn };
  });
