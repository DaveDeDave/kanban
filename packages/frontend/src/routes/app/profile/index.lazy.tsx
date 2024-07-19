import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/profile/")({
  component: () => <div>Hello /app/profile/!</div>
});
