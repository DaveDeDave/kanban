import { PrismaClient } from "@prisma/client";
import { createCallerFactory } from "../src/trpc/init";
import { inferRouterContext, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { getJwtHelper } from "@kanban/base-lib";
import { AppRouter, appRouter } from "../src/trpc/router";

export const createCaller = createCallerFactory(appRouter);
export type Caller = ReturnType<typeof createCaller>;
export type Context = inferRouterContext<AppRouter>;
type CreateContextInput = {
  headers?: HeadersInit;
};
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export const createContext = async (options?: CreateContextInput): Promise<Context> => {
  const headers = new Headers(options?.headers);
  const prisma = new PrismaClient();
  const jwt = await getJwtHelper("secret" ?? process.env.JWT_SECRET!);

  return {
    headers,
    prisma,
    helpers: {
      jwt
    }
  };
};
