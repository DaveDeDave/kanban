import { publicProcedure } from "@/trpc/procedures";
import { passwordRegex } from "@kanban/base-lib";
import { z } from "zod";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email().trim().toLowerCase(),
      password: z.string().regex(passwordRegex)
    })
  )
  .output(
    z.object({
      token: z.string()
    })
  )
  .mutation(async ({ input, ctx }) => ctx.services.authentication.register(input.email, input.password));
