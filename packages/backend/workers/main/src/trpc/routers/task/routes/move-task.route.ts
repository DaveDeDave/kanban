import { authProcedure } from "@/trpc/procedures";
import { HttpNotFoundException } from "@kanban/base-lib";
import { z } from "zod";

const taskOrderSchema = z.object({
  taskId: z.string(),
  order: z.number().nullable()
});

export default authProcedure
  .input(
    z.object({
      fromColumnId: z.string(),
      toColumnId: z.string(),
      taskId: z.string(),
      tasksOrder: z.array(taskOrderSchema)
    })
  )
  .output(
    z.object({
      fromColumnId: z.string(),
      toColumnId: z.string(),
      taskId: z.string(),
      tasksOrder: z.array(taskOrderSchema)
    })
  )
  .mutation(
    async ({ input: { fromColumnId, toColumnId, taskId, tasksOrder }, ctx: { prisma, user } }) => {
      const fromColumn = await prisma.column.findUnique({
        where: {
          id: fromColumnId,
          board: {
            ownerId: user.id
          }
        }
      });

      const toColumn = await prisma.column.findUnique({
        where: {
          id: toColumnId,
          board: {
            ownerId: user.id
          }
        }
      });

      if (!fromColumn || !toColumn) {
        throw new HttpNotFoundException({
          errorCode: "ColumnNotFound"
        });
      }

      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
          columnId: fromColumn.id
        }
      });

      if (!task) {
        throw new HttpNotFoundException({
          errorCode: "TaskNotFound"
        });
      }

      const newTasksOrder = await prisma.$transaction(async ($tx) => {
        const a = await $tx.task.update({
          where: {
            id: task.id
          },
          data: {
            columnId: toColumn.id
          }
        });
        console.log(a);

        const newOrder = await Promise.all(
          tasksOrder.map(async (taskOrder) => {
            const task = await $tx.task.findFirst({
              where: {
                columnId: toColumnId,
                id: taskOrder.taskId
              }
            });

            if (task) {
              return $tx.task.update({
                where: {
                  id: task.id
                },
                data: {
                  order: taskOrder.order
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
        fromColumnId,
        toColumnId,
        taskId,
        tasksOrder: newTasksOrder.map((task) => ({
          taskId: task.id,
          order: task.order
        }))
      };
    }
  );
