import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/boards/")({
  // TODO: empty state boards page
  component: () => (
    <div
      style={{
        padding: 16,
        paddingLeft: 24
      }}
    >
      Select a board from the list
    </div>
  )
});
