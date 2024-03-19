import { authProcedure } from "@/trpc/init";
import { SubtaskNotFoundException, subtaskSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      subtaskId: z.string()
    })
  )
  .output(
    z.object({
      deletedSubtask: subtaskSchema
    })
  )
  .mutation(async ({ input: { subtaskId }, ctx: { prisma, user } }) => {
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

    const deletedSubtask = await prisma.subtask.delete({
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

    return { deletedSubtask };
  });
