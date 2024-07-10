import { createFileRoute } from "@tanstack/react-router";
import { PublicStructure } from "@/templates/public-structure";

export const Route = createFileRoute("/_public")({
  component: PublicStructure
});
