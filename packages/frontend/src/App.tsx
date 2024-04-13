import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./config/trpc.config";
import { httpBatchLink } from "@trpc/client";
import envConfig from "./config/env.config";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router.config";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
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

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
