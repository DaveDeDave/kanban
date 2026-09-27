import { authProcedure } from "@/trpc/procedures";
import { populatedBoardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      boardId: z.string()
    })
  )
  .output(
    z.object({
      board: populatedBoardSchema
    })
  )
  .query(async ({ input, ctx }) => ctx.services.board.getBoardById(input.boardId, ctx.user.id));
