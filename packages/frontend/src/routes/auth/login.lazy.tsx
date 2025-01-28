import { createLazyFileRoute } from "@tanstack/react-router";
import { Component } from "@/pages/authentication/login";

export const Route = createLazyFileRoute("/auth/login")({
  component: Component
});
