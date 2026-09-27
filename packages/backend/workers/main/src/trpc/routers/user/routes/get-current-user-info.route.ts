import { authProcedure } from "@/trpc/procedures";
import { z } from "zod";

export default authProcedure
  .output(
    z.object({
      user: z.object({
        id: z.string(),
        email: z.string().email()
      })
    })
  )
  .query(async ({ ctx }) => ctx.services.user.getCurrentUserInfo(ctx.user.id));
