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
  .mutation(async ({ ctx: { user, prisma } }) => {
    const deletedUser = await prisma.user.delete({
      where: {
        id: user.id
      },
      select: {
        id: true,
        email: true
      }
    });

    return { deletedUser };
  });
