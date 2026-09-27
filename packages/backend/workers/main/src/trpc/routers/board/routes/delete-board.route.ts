import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string()
    })
  )
  .output(
    z.object({
      deletedBoard: boardSchema
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.board.deleteBoard(input.boardId, ctx.user.id));
