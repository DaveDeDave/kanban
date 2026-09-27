import { authProcedure } from "@/trpc/procedures";
import { columnSchema, HttpNotFoundException } from "@kanban/base-lib";
import { LexoRank } from "lexorank";
import { TRPCError } from "@trpc/server";
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
        where: { id: boardId, ownerId: user.id }
      });
      if (!board) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });

      return prisma.$transaction(async (tx) => {
        // All order-changing mutations on this board acquire this lock first.
        await tx.$queryRaw`SELECT id FROM "Board" WHERE id = ${boardId} FOR UPDATE`;
        const ordered = await tx.column.findMany({
          where: { boardId },
          orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
          select: { id: true, rank: true }
        });
        if (!ordered.some(({ id }) => id === columnId)) {
          throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
        }

        const remaining = ordered.filter(({ id }) => id !== columnId);
        const previousIndex = previousColumnId
          ? remaining.findIndex(({ id }) => id === previousColumnId)
          : -1;
        const nextIndex = nextColumnId ? remaining.findIndex(({ id }) => id === nextColumnId) : -1;
        const validPosition =
          previousColumnId === null
            ? nextColumnId === null
              ? remaining.length === 0
              : nextIndex === 0
            : nextColumnId === null
            ? previousIndex >= 0 && previousIndex === remaining.length - 1
            : previousIndex >= 0 && nextIndex === previousIndex + 1;
        if (!validPosition) {
          throw new TRPCError({ code: "CONFLICT", message: "Column order has changed" });
        }

        const previous = remaining[previousIndex];
        const next = remaining[nextIndex];
        let rank: string;
        try {
          if (previous && next) {
            rank = LexoRank.parse(previous.rank).between(LexoRank.parse(next.rank)).toString();
          } else if (previous) {
            rank = LexoRank.parse(previous.rank).genNext().toString();
          } else if (next) {
            rank = LexoRank.parse(next.rank).genPrev().toString();
          } else {
            rank = LexoRank.middle().toString();
          }
        } catch {
          throw new TRPCError({ code: "CONFLICT", message: "Column rank cannot be calculated" });
        }

        const column = await tx.column.update({
          where: { id: columnId, boardId },
          data: { rank }
        });
        return { boardId, column };
      });
    }
  );
