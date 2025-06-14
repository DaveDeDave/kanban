import { createLazyFileRoute } from "@tanstack/react-router";
import { Component } from "@/pages/app/settings";

export const Route = createLazyFileRoute("/app/settings/")({
  component: Component
});
