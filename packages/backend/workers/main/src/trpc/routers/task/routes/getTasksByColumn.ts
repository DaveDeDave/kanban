import { authProcedure } from "@/trpc/init";
import { taskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      columnId: z.string()
    })
  )
  .output(
    z.object({
      tasks: z.array(taskSchema)
    })
  )
  .query(async ({ input: { columnId }, ctx: { prisma, user } }) => {
    const tasks = await prisma.task.findMany({
      where: {
        columnId,
        column: {
          board: {
            ownerId: user.id
          }
        }
      }
    });

    return {
      tasks
    };
  });
