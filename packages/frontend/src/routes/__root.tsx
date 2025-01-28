import envConfig from "@/config/env.config";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppContextProvider } from "@/contexts/app.context";

export const Route = createRootRoute({
  component: () => (
    <>
      <AppContextProvider>
        <Outlet />
      </AppContextProvider>
      {envConfig.VITE_REACT_QUERY_DEVTOOLS && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
      {envConfig.VITE_REACT_ROUTER_DEVTOOLS && <TanStackRouterDevtools initialIsOpen={false} />}
    </>
  )
});
