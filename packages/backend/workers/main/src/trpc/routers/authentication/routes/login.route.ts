import { publicProcedure } from "@/trpc/procedures";
import { z } from "zod";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email().trim().toLowerCase(),
      password: z.string()
    })
  )
  .output(
    z.object({
      token: z.string()
    })
  )
  .mutation(async ({ input, ctx }) =>
    ctx.services.authentication.login(input.email, input.password)
  );
