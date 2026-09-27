import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException, taskSchema } from "@kanban/base-lib";
import { LexoRank } from "lexorank";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string(),
      moveToColumnId: z.string().nullable().optional(),
      taskId: z.string(),
      previousTaskId: z.string().nullable(),
      nextTaskId: z.string().nullable()
    })
  )
  .output(
    z.object({
      columnId: z.string(),
      task: taskSchema
    })
  )
  .mutation(
    async ({
      input: { columnId, taskId, previousTaskId, nextTaskId, moveToColumnId },
      ctx: { prisma, user }
    }) => {
      const column = await prisma.column.findUnique({
        where: {
          id: columnId,
          board: {
            ownerId: user.id
          }
        }
      });

      if (!column) {
        throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
      }

      return prisma.$transaction(async (tx) => {
        // Serialize ordering changes for this board before reading neighbors.
        await tx.$queryRaw`SELECT id FROM "Board" WHERE id = ${column.boardId} FOR UPDATE`;
        const sourceColumn = await tx.column.findUnique({ where: { id: columnId } });
        const toColumn = moveToColumnId
          ? await tx.column.findUnique({
              where: {
                id: moveToColumnId,
                board: {
                  ownerId: user.id
                }
              }
            })
          : null;

        const targetColumnId = moveToColumnId ?? columnId;

        if (
          !sourceColumn ||
          sourceColumn.boardId !== column.boardId ||
          (moveToColumnId && (!toColumn || toColumn.boardId !== column.boardId))
        ) {
          throw new HttpNotFoundException({
            errorCode: "ColumnNotFound"
          });
        }

        const task = await tx.task.findFirst({
          where: {
            id: taskId,
            columnId
          }
        });

        if (!task) {
          throw new HttpNotFoundException({
            errorCode: "TaskNotFound"
          });
        }

        const neighborIds = [previousTaskId, nextTaskId].filter((id): id is string => !!id);
        const neighbors = neighborIds.length
          ? await tx.task.findMany({
              where: { id: { in: neighborIds }, columnId: targetColumnId },
              select: { id: true, rank: true }
            })
          : [];
        const previousTask = neighbors.find(({ id }) => id === previousTaskId);
        const nextTask = neighbors.find(({ id }) => id === nextTaskId);

        if (
          (previousTaskId && !previousTask) ||
          (nextTaskId && !nextTask) ||
          (previousTask && nextTask && previousTask.rank >= nextTask.rank)
        ) {
          throw new TRPCError({ code: "CONFLICT", message: "Task order has changed" });
        }

        const taskBetweenNeighbors = await tx.task.findFirst({
          where: {
            columnId: targetColumnId,
            id: { notIn: [taskId, ...neighborIds] },
            rank:
              previousTask && nextTask
                ? { gte: previousTask.rank, lte: nextTask.rank }
                : previousTask
                ? { gte: previousTask.rank }
                : nextTask
                ? { lte: nextTask.rank }
                : undefined
          },
          select: { id: true }
        });
        if (taskBetweenNeighbors) {
          throw new TRPCError({ code: "CONFLICT", message: "Task order has changed" });
        }

        let newRank: string;

        try {
          // Generate a new rank based on the position of the previous and next tasks
          if (previousTask && nextTask) {
            const previousRank = LexoRank.parse(previousTask.rank);
            const nextRank = LexoRank.parse(nextTask.rank);
            newRank = previousRank.between(nextRank).toString();
          } else if (previousTask) {
            const previousRank = LexoRank.parse(previousTask.rank);
            newRank = previousRank.genNext().toString();
          } else if (nextTask) {
            const nextRank = LexoRank.parse(nextTask.rank);
            newRank = nextRank.genPrev().toString();
          } else {
            newRank = LexoRank.middle().toString();
          }
        } catch {
          // TODO: rebalance the target column's ranks atomically and retry this move.
          // Until then, reject it rather than persisting an empty or invalid rank.
          throw new TRPCError({ code: "CONFLICT", message: "Task rank cannot be calculated" });
        }

        const updatedTask = await tx.task.update({
          where: {
            id: taskId,
            columnId
          },
          data: {
            rank: newRank,
            columnId: toColumn ? toColumn.id : undefined
          }
        });

        return {
          columnId,
          task: updatedTask
        };
      });
    }
  );
