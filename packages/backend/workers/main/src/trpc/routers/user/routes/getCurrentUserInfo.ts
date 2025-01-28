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
  .query(
    async ({
      ctx: {
        user: { id },
        prisma
      }
    }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: id
        },
        select: {
          id: true,
          email: true
        }
      });

      return { user: user! };
    }
  );
