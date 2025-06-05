import { Component } from "@/pages/app/boards";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/boards/")({
  component: Component
});
