import { Env } from "@/config/env.config";
import {
  ExpiredTokenException,
  HttpException,
  InvalidTokenException,
  MissingTokenException,
  UnauthorizedException,
  getJwtHelper
} from "@kanban/base-lib";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, User } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Pool } from "pg";

const createContext = async ({ req, env }: FetchCreateContextFnOptions & { env: Env }) => {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({
    adapter
  });
  const jwt = await getJwtHelper(env.JWT_SECRET);

  return {
    headers: req.headers,
    prisma,
    helpers: {
      jwt
    }
  };
};

const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    const { cause } = error;

    if (cause instanceof HttpException) {
      if (cause.statusCode === "INTERNAL_SERVER_ERROR") {
        // logger.fatal
        console.log({
          level: "fatal",
          shape,
          error,
          cause: error.cause
        });

        return {
          ...shape,
          message: error.code,
          data: {
            ...shape.data,
            stack: ""
          }
        };
      }

      // logger.error
      console.log({
        level: "error",
        shape,
        error,
        cause: error.cause
      });

      return {
        errorCode: cause.errorCode,
        code: cause.code,
        message: cause.message,
        data: {
          code: cause.code,
          httpStatus: cause.statusCode,
          stack: "",
          path: shape.data.path
        }
      };
    }

    if (error.code === "INTERNAL_SERVER_ERROR") {
      // logger.fatal
      console.log({
        level: "fatal",
        shape,
        error,
        cause: error.cause
      });

      return {
        ...shape,
        message: error.code,
        data: {
          ...shape.data,
          stack: ""
        }
      };
    }

    // logger.error
    console.log({
      level: "error",
      shape,
      error,
      cause: error.cause
    });

    return { ...shape };
  }
});

const authenticate = t.middleware(async ({ ctx, next }) => {
  const authorizationHeader = ctx.headers.get("authorization");
  if (!authorizationHeader) {
    throw new MissingTokenException();
  }

  const token = authorizationHeader.replace("Bearer ", "");
  let payload: User | undefined;

  console.log("the token", token);
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

const publicProcedure = t.procedure;
const authProcedure = publicProcedure.use(authenticate);
const { router } = t;

export { createContext, router, publicProcedure, authProcedure };
