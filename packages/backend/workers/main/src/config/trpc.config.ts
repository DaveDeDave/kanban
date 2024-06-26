import { Env } from "@/config/env.config";
import { getPrismaClient } from "@/config/prisma.config";
import { HttpException, getJwtHelper } from "@kanban/base-lib";
import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

const createContext = async ({ req, env }: FetchCreateContextFnOptions & { env: Env }) => {
  const prisma = getPrismaClient(env.DATABASE_URL);
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

const { createCallerFactory, router, middleware, procedure } = t;

export { createContext, createCallerFactory, router, middleware, procedure };
