import { publicProcedure } from "@/trpc/procedures";
import { EmailAlreadyExistsException, hash, passwordRegex } from "@kanban/base-lib";
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
  .mutation(
    async ({
      input: { email, password },
      ctx: {
        prisma,
        helpers: { jwt }
      }
    }) => {
      const userExists = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (userExists) {
        throw new EmailAlreadyExistsException();
      }

      const hashedPassword = await hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword
        },
        select: {
          id: true,
          email: true
        }
      });

      const token = await jwt.sign(user);

      return {
        token
      };
    }
  );
