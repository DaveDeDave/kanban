import { createLazyFileRoute } from "@tanstack/react-router";
import { Component } from "@/pages/public/home";

export const Route = createLazyFileRoute("/_public/")({
  component: Component
});
