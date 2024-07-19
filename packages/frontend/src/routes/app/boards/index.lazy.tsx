import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/boards/")({
  // TODO: empty state boards page
  component: () => <div>Select a board</div>
});
