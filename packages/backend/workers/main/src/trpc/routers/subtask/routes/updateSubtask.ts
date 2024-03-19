import { authProcedure } from "@/trpc/init";
import { SubtaskNotFoundException, subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      description: z.string().optional(),
      completed: z.boolean().optional(),
      subtaskId: z.string()
    })
  )
  .output(
    z.object({
      updatedSubtask: subtaskSchema
    })
  )
  .mutation(async ({ input: { subtaskId, completed, description }, ctx: { prisma, user } }) => {
    const subtask = await prisma.subtask.findUnique({
      where: {
        id: subtaskId,
        task: {
          column: {
            board: {
              ownerId: user.id
            }
          }
        }
      }
    });

    if (!subtask) {
      throw new SubtaskNotFoundException();
    }

    const updatedSubtask = await prisma.subtask.update({
      where: {
        id: subtaskId,
        task: {
          column: {
            board: {
              ownerId: user.id
            }
          }
        }
      },
      data: {
        completed,
        description
      }
    });

    return {
      updatedSubtask
    };
  });
