import { authProcedure } from "@/trpc/procedures";
import { boardSchema } from "@kanban/base-lib";
import { z } from "zod";

export default authProcedure
  .input(
    z.object({
      limit: z.number().default(20),
      cursor: z.string().nullish()
    })
  )
  .output(
    z.object({
      boards: z.array(boardSchema),
      nextCursor: z.string().optional()
    })
  )
  .query(async ({ input, ctx }) => ctx.services.board.getBoards(input, ctx.user.id));
