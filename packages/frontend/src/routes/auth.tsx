import { createFileRoute } from "@tanstack/react-router";
import { AuthenticationStructure } from "@/templates/authentication-structure";

export const Route = createFileRoute("/auth")({
  component: () => <AuthenticationStructure />
});
