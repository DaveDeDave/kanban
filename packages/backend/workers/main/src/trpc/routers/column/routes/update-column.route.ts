import { authProcedure } from "@/trpc/procedures";
import { columnSchema, HttpNotFoundException } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string(),
      name: z.string().optional(),
      color: z.string().optional()
    })
  )
  .output(
    z.object({
      updatedColumn: columnSchema
    })
  )
  .mutation(async ({ input: { columnId, name, color }, ctx: { prisma, user } }) => {
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

    const updatedColumn = await prisma.column.update({
      where: {
        id: columnId,
        board: {
          ownerId: user.id
        }
      },
      data: {
        name,
        color
      }
    });

    return {
      updatedColumn
    };
  });
