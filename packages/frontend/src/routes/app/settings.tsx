import { SettingsStructure } from "@/templates/settings-structure";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings")({
  component: SettingsStructure
});
