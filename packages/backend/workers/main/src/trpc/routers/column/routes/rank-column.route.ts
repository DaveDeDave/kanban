import { authProcedure } from "@/trpc/procedures";
import { columnSchema, HttpNotFoundException } from "@kanban/base-lib";
import { LexoRank } from "lexorank";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string(),
      columnId: z.string(),
      previousColumnId: z.string().nullable(),
      nextColumnId: z.string().nullable()
    })
  )
  .output(
    z.object({
      boardId: z.string(),
      column: columnSchema
    })
  )
  .mutation(
    async ({
      input: { boardId, columnId, previousColumnId, nextColumnId },
      ctx: { prisma, user }
    }) => {
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

      const column = await prisma.column.findFirst({
        where: {
          id: columnId,
          boardId
        }
      });

      if (!column) {
        throw new HttpNotFoundException({
          errorCode: "ColumnNotFound"
        });
      }

      const previousColumn = previousColumnId
        ? await prisma.column.findFirst({
            where: {
              id: previousColumnId,
              boardId
            }
          })
        : null;
      const nextColumn = nextColumnId
        ? await prisma.column.findFirst({
            where: {
              id: nextColumnId,
              boardId
            }
          })
        : null;

      let newRank: string = "";
      let needRebalance = false;

      try {
        // Generate a new rank based on the position of the previous and next tasks
        if (previousColumn && nextColumn) {
          const previousRank = LexoRank.parse(previousColumn.rank);
          const nextRank = LexoRank.parse(nextColumn.rank);
          newRank = previousRank.between(nextRank).toString();
        } else if (previousColumn) {
          const previousRank = LexoRank.parse(previousColumn.rank);
          newRank = previousRank.genNext().toString();
        } else if (nextColumn) {
          const nextRank = LexoRank.parse(nextColumn.rank);
          newRank = nextRank.genPrev().toString();
        } else {
          newRank = LexoRank.middle().toString();
        }
      } catch (e) {
        // In case of an error (e.g., ranks are too close), we set a flag to rebalance
        needRebalance = true;
      }

      if (needRebalance) {
        // TODO: handle rebalancing ranks when necessary
      }

      const updatedColumn = await prisma.column.update({
        where: {
          id: columnId,
          boardId
        },
        data: {
          rank: newRank
        }
      });

      return {
        boardId,
        column: updatedColumn
      };
    }
  );
