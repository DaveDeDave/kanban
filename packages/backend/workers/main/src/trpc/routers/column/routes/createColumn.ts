import { authProcedure } from "@/trpc/procedures";
import { BoardNotFoundException, columnSchema } from "@kanban/base-lib";
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
      throw new BoardNotFoundException();
    }

    const createdColumn = await prisma.column.create({
      data: {
        name,
        color,
        boardId
      }
    });

    return { createdColumn };
  });
