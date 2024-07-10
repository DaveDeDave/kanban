import { AuthStructure } from "@/templates/auth-structure";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: AuthStructure
});
