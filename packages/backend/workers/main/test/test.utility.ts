import { getDatabase } from "../src/config/db.config";
import { createRepositories } from "../src/repositories/unit-of-work";
import { createServices } from "../src/services";
import { createCallerFactory } from "../src/config/trpc.config";
import { inferRouterContext, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter, appRouter } from "../src/trpc/app-router";

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
  return {
    headers,
    services: await createServices(process.env.DATABASE_URL!, process.env.JWT_SECRET ?? "secret")
  };
};

export const createFixture = () => {
  const { db, pool } = getDatabase(process.env.DATABASE_URL!);
  return { repositories: createRepositories(db), close: () => pool.end() };
};
export type Fixture = ReturnType<typeof createFixture>;
