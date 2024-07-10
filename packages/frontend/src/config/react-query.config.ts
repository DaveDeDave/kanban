import { QueryClient } from "@tanstack/react-query";
import { trpc } from "./trpc.config";
import { httpBatchLink } from "@trpc/client";
import envConfig from "./env.config";

export const queryClient = new QueryClient();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: envConfig.VITE_MAIN_WORKER_ENDPOINT,
      async headers() {
        const authorization = localStorage.getItem("accessToken") ?? "";
        return {
          authorization
        };
      }
    })
  ]
});
