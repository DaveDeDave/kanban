import { authProcedure } from "@/trpc/init";
import { columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.number()
    })
  )
  .output(
    z.object({
      columns: z.array(columnSchema)
    })
  )
  .query(async ({ input: { boardId }, ctx: { prisma, user } }) => {
    const columns = await prisma.column.findMany({
      where: {
        boardId,
        board: {
          ownerId: user.id
        }
      }
    });

    return {
      columns
    };
  });
