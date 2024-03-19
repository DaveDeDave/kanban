import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/init";
import { Env, envSchema } from "./config/env.config";
import { addCORSHeadersToRequest, handleCORSPreflight } from "@kanban/base-lib";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsOptions = { origin: env.FRONTEND_URL };
    if (request.method === "OPTIONS") {
      return handleCORSPreflight(corsOptions);
    }

    const parsedEnv = await envSchema.parseAsync(env);
    const trpcRequest = await fetchRequestHandler({
      endpoint: "/trpc",
      req: request,
      router: appRouter,
      createContext: (options: FetchCreateContextFnOptions) =>
        createContext({ ...options, env: parsedEnv })
    });

    return addCORSHeadersToRequest(trpcRequest, corsOptions);
  }
};
