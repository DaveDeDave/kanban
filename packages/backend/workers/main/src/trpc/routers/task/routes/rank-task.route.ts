import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException, taskSchema } from "@kanban/base-lib";
import { LexoRank } from "lexorank";
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

      const toColumn = moveToColumnId
        ? await prisma.column.findUnique({
            where: {
              id: moveToColumnId,
              board: {
                ownerId: user.id
              }
            }
          })
        : null;

      const targetColumnId = moveToColumnId ?? columnId;

      if (!column || (moveToColumnId && !toColumn)) {
        throw new HttpNotFoundException({
          errorCode: "ColumnNotFound"
        });
      }

      const task = await prisma.task.findFirst({
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

      const previousTask = previousTaskId
        ? await prisma.task.findFirst({ where: { id: previousTaskId, columnId: targetColumnId } })
        : null;
      const nextTask = nextTaskId
        ? await prisma.task.findFirst({ where: { id: nextTaskId, columnId: targetColumnId } })
        : null;

      let newRank: string = "";
      let needRebalance = false;

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
      } catch (e) {
        // In case of an error (e.g., ranks are too close), we set a flag to rebalance
        needRebalance = true;
      }

      if (needRebalance) {
        // TODO: handle rebalancing ranks when necessary
      }

      const updatedTask = await prisma.task.update({
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
    }
  );
