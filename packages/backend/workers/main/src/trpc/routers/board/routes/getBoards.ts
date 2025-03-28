import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .output(
    z.object({
      boards: z.array(boardSchema)
    })
  )
  .query(async ({ ctx: { prisma, user } }) => {
    const boards = await prisma.board.findMany({
      where: {
        ownerId: user.id
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return {
      boards
    };
  });
