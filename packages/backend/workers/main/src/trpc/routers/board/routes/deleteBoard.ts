import { authProcedure } from "@/trpc/init";
import { BoardNotFoundException, boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.number()
    })
  )
  .output(
    z.object({
      deletedBoard: boardSchema
    })
  )
  .mutation(async ({ input: { boardId }, ctx: { prisma, user } }) => {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: user.id
      }
    });

    if (!board) {
      throw new BoardNotFoundException();
    }

    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId,
        ownerId: user.id
      }
    });

    return { deletedBoard };
  });
