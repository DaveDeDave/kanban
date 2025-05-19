import { middleware } from "@/config/trpc.config";
import {
  ExpiredTokenException,
  InvalidTokenException,
  HttpUnauthorizedException
} from "@kanban/base-lib";
import { User } from "@prisma/client";

export const withAuthentication = middleware(async ({ ctx, next }) => {
  const authorizationHeader = ctx.headers.get("authorization");
  if (!authorizationHeader) {
    throw new HttpUnauthorizedException({
      errorCode: "MissingToken"
    });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  let payload: User | undefined;

  try {
    payload = (await ctx.helpers.jwt.verify(token)) as User;
  } catch (e) {
    if (e instanceof InvalidTokenException || e instanceof ExpiredTokenException) {
      throw new HttpUnauthorizedException({
        errorCode: "Unauthorized",
        cause: e
      });
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
    throw new HttpUnauthorizedException({
      errorCode: "Unauthorized",
      message: "Unauthorized. User does not exists"
    });
  }

  return next({
    ctx: {
      user
    }
  });
});
