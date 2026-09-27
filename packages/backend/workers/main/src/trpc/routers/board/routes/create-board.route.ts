import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string()
    })
  )
  .output(
    z.object({
      createdBoard: boardSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.board.createBoard(input, ctx.user.id));
