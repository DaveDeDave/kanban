import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./config/trpc.config";
import { Env, envSchema } from "./config/env.config";
import { addCORSHeadersToRequest, handleCORSPreflight } from "@kanban/base-lib";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsOptions = { origin: env.FRONTEND_URL };
    if (request.method === "OPTIONS") {
      return handleCORSPreflight(corsOptions);
    }

    const parsedEnv = await envSchema.parseAsync(env);
    let services: Awaited<ReturnType<typeof createContext>>["services"] | undefined;
    try {
      const trpcRequest = await fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: appRouter,
        createContext: async (options: FetchCreateContextFnOptions) => {
          const context = await createContext({ ...options, env: parsedEnv });
          services = context.services;
          return context;
        }
      });
      return addCORSHeadersToRequest(trpcRequest, corsOptions);
    } finally {
      await services?.close();
    }
  }
};
