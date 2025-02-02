import { authProcedure } from "@/trpc/procedures";
import { BoardNotFoundException, populatedBoardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string()
    })
  )
  .output(
    z.object({
      board: populatedBoardSchema
    })
  )
  .query(async ({ input: { boardId }, ctx: { prisma, user } }) => {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: user.id
      },
      include: {
        columns: {
          orderBy: {
            createdAt: "asc"
          },
          include: {
            tasks: {
              orderBy: {
                createdAt: "asc"
              }
            }
          }
        }
      }
    });

    if (!board) {
      throw new BoardNotFoundException();
    }

    return {
      board
    };
  });
