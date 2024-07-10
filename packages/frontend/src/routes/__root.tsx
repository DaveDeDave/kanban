import envConfig from "@/config/env.config";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {envConfig.VITE_REACT_QUERY_DEVTOOLS && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
      {envConfig.VITE_REACT_ROUTER_DEVTOOLS && <TanStackRouterDevtools initialIsOpen={false} />}
    </>
  )
});
