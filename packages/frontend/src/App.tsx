import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";
import { trpc } from "./config/trpc.config";
import { httpBatchLink } from "@trpc/client";
import envConfig from "./config/env.config";

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
        <Router />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
