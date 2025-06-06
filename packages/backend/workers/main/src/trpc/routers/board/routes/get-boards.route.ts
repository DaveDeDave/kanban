import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      limit: z.number().default(20),
      cursor: z.string().nullish()
    })
  )
  .output(
    z.object({
      boards: z.array(boardSchema),
      nextCursor: z.string().optional()
    })
  )
  .query(async ({ ctx: { prisma, user }, input: { limit, cursor } }) => {
    const boards = await prisma.board.findMany({
      take: limit + 1,
      where: {
        ownerId: user.id
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [
        {
          createdAt: "asc"
        },
        {
          id: "asc"
        }
      ]
    });

    let nextCursor: string | undefined;
    if (boards.length > limit) {
      nextCursor = boards.pop()?.id;
    }

    return {
      boards,
      nextCursor
    };
  });
