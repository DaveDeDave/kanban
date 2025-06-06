import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string()
    })
  )
  .output(
    z.object({
      createdBoard: boardSchema
    })
  )
  .mutation(async ({ input: { name, description }, ctx: { prisma, user } }) => {
    const createdBoard = await prisma.board.create({
      data: {
        name,
        description,
        ownerId: user.id
      }
    });

    return { createdBoard };
  });
