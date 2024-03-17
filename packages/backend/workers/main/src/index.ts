// import { errorHandler } from "@kanban/lib/src/middleware";
// import { handle, corsify } from "./main";
import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/init";
import { Env, envSchema } from "./config/env.config";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const parsedEnv = await envSchema.parseAsync(env);
    return fetchRequestHandler({
      endpoint: "/trpc",
      req: request,
      router: appRouter,
      createContext: (options: FetchCreateContextFnOptions) =>
        createContext({ ...options, env: parsedEnv })
    });
  }
};
