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
      columnId: z.string(),
      tasksOrder: z.array(taskOrderSchema)
    })
  )
  .output(
    z.object({
      columnId: z.string(),
      tasksOrder: z.array(taskOrderSchema)
    })
  )
  .mutation(async ({ input: { columnId, tasksOrder }, ctx: { prisma, user } }) => {
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

    const newTasksOrder = await prisma.$transaction(async ($tx) => {
      const newOrder = await Promise.all(
        tasksOrder.map(async (taskOrder) => {
          const task = await $tx.task.findFirst({
            where: {
              columnId,
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
      columnId,
      tasksOrder: newTasksOrder.map((task) => ({
        // typescript requires non-null assertion operator
        taskId: task!.id,
        order: task!.order
      }))
    };
  });
