import { authProcedure } from "@/trpc/init";
import { ColumnNotFoundException, columnSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string()
    })
  )
  .output(
    z.object({
      deletedColumn: columnSchema
    })
  )
  .mutation(async ({ input: { columnId }, ctx: { prisma, user } }) => {
    const column = await prisma.column.findUnique({
      where: {
        id: columnId,
        board: {
          ownerId: user.id
        }
      }
    });

    if (!column) {
      throw new ColumnNotFoundException();
    }

    const deletedColumn = await prisma.column.delete({
      where: {
        id: columnId,
        board: {
          ownerId: user.id
        }
      }
    });

    return { deletedColumn };
  });
