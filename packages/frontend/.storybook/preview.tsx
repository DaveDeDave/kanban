import type { Preview } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from "@tanstack/react-router";
import "../src/index.scss";
// @ts-ignore
import "../src/config/i18n.config";

const rootRoute = createRootRoute();
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/"
});
const routeTree = rootRoute.addChildren([indexRoute]);
const memoryHistory = createMemoryHistory({
  initialEntries: ["/"]
});
const router = createRouter({ routeTree, history: memoryHistory });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => <RouterProvider router={router} defaultComponent={() => <Story />}></RouterProvider>
  ]
};

export default preview;
