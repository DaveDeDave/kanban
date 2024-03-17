import { authProcedure } from "@/trpc/init";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      name: z.string()
    })
  )
  .output(
    z.object({
      createdBoard: boardSchema
    })
  )
  .mutation(async ({ input: { name }, ctx: { prisma, user } }) => {
    const createdBoard = await prisma.board.create({
      data: {
        name,
        ownerId: user.id
      }
    });

    return { createdBoard };
  });
