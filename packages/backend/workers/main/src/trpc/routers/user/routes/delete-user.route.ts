import { authProcedure } from "@/trpc/procedures";
import { z } from "zod";

export default authProcedure
  .output(
    z.object({
      deletedUser: z.object({
        id: z.string(),
        email: z.string().email()
      })
    })
  )
  .mutation(async ({ ctx }) => ctx.services.user.deleteUser(ctx.user.id));
