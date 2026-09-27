import { authProcedure } from "@/trpc/procedures";
import { columnSchema, HttpNotFoundException } from "@kanban/base-lib";
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
      throw new HttpNotFoundException({
        errorCode: "ColumnNotFound"
      });
    }

    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "Board" WHERE id = ${column.boardId} FOR UPDATE`;
      const deletedColumn = await tx.column.delete({
        where: {
          id: columnId,
          board: {
            ownerId: user.id
          }
        }
      });

      return { deletedColumn };
    });
  });
