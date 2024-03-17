import { publicProcedure } from "@/trpc/init";
import { WrongCredentialsException, compare } from "@kanban/base-lib";
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
  .mutation(
    async ({
      input: { email, password },
      ctx: {
        prisma,
        helpers: { jwt }
      }
    }) => {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });
      if (!user) {
        throw new WrongCredentialsException();
      }

      const isPasswordCorrect = await compare(password, user.hashedPassword);
      if (!isPasswordCorrect) {
        throw new WrongCredentialsException();
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email
      });

      return {
        token
      };
    }
  );
