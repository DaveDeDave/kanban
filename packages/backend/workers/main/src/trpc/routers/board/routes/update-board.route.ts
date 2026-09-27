import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string(),
      name: z.string(),
      description: z.string()
    })
  )
  .output(
    z.object({
      updatedBoard: boardSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.board.updateBoard(input, ctx.user.id));
