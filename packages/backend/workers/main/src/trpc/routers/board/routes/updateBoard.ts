import { authProcedure } from "@/trpc/procedures";
import { BoardNotFoundException, boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string(),
      name: z.string(),
      description: z.string()
    })
  )
  .output(
    z.object({
      updatedBoard: boardSchema
    })
  )
  .mutation(async ({ input: { boardId, name, description }, ctx: { prisma, user } }) => {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: user.id
      }
    });

    if (!board) {
      throw new BoardNotFoundException();
    }

    const updatedBoard = await prisma.board.update({
      where: {
        id: boardId,
        ownerId: user.id
      },
      data: {
        name,
        description
      }
    });

    return {
      updatedBoard
    };
  });
