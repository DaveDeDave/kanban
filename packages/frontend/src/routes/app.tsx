import { AuthenticatedAreaStructure } from "@/templates/authenticated-area-structure";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: AuthenticatedAreaStructure
});
