import { createLazyFileRoute } from "@tanstack/react-router";
import { Component } from "@/pages/public/about";

export const Route = createLazyFileRoute("/_public/about")({
  component: Component
});
