import { createTRPCReact, inferReactQueryProcedureOptions } from "@trpc/react-query";
import type { AppRouter } from "../../../backend/workers/main/src/trpc/router";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();
