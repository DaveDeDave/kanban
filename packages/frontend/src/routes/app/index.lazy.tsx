import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/")({
  component: () => <div>Hello /app/!</div>
});
