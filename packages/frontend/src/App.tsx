import { QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./config/trpc.config";
import { router } from "./config/router.config";
import { queryClient, trpcClient } from "./config/react-query.config";
import { RouterProvider } from "@tanstack/react-router";

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
