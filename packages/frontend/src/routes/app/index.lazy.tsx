import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/")({
  // TODO: empty state dashboard
  component: () => <div>Select an option from the sidebar</div>
});
