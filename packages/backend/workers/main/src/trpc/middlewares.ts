import { middleware } from "@/config/trpc.config";
import {
  ExpiredTokenException,
  InvalidTokenException,
  MissingTokenException,
  UnauthorizedException
} from "@kanban/base-lib";
import { User } from "@prisma/client";

export const withAuthentication = middleware(async ({ ctx, next }) => {
  const authorizationHeader = ctx.headers.get("authorization");
  if (!authorizationHeader) {
    throw new MissingTokenException();
  }

  const token = authorizationHeader.replace("Bearer ", "");
  let payload: User | undefined;

  try {
    payload = (await ctx.helpers.jwt.verify(token)) as User;
  } catch (e) {
    if (e instanceof InvalidTokenException || e instanceof ExpiredTokenException) {
      throw new UnauthorizedException("Unauthorized", e);
    } else {
      throw e;
    }
  }

  const user = await ctx.prisma.user.findUnique({
    where: {
      id: payload.id
    },
    select: {
      id: true,
      email: true
    }
  });

  if (!user) {
    throw new UnauthorizedException("Unauthorized. User does not exists");
  }

  return next({
    ctx: {
      user
    }
  });
});
