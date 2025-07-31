import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException } from "@kanban/base-lib";
import { z } from "zod";

const columnOrderSchema = z.object({
  columnId: z.string(),
  order: z.number().nullable()
});

export default authProcedure
  .input(
    z.object({
      boardId: z.string(),
      columnsOrder: z.array(columnOrderSchema)
    })
  )
  .output(
    z.object({
      columnsOrder: z.array(columnOrderSchema)
    })
  )
  .mutation(async ({ input: { boardId, columnsOrder }, ctx: { prisma, user } }) => {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: user.id
      }
    });

    if (!board) {
      throw new HttpNotFoundException({
        errorCode: "BoardNotFound"
      });
    }

    const newColumnOrder = await prisma.$transaction(async ($tx) => {
      const newOrder = await Promise.all(
        columnsOrder.map(async (columnOrder) => {
          const column = await $tx.column.findFirst({
            where: {
              boardId: boardId,
              id: columnOrder.columnId
            }
          });

          if (column) {
            return $tx.column.update({
              where: {
                id: column.id
              },
              data: {
                order: columnOrder.order
              },
              select: {
                id: true,
                order: true
              }
            });
          }
        })
      );

      return newOrder.filter((order) => order !== undefined);
    });

    return {
      columnsOrder: newColumnOrder.map((column) => ({
        columnId: column.id,
        order: column.order
      }))
    };
  });
