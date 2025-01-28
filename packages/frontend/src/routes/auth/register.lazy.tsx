import { createLazyFileRoute } from "@tanstack/react-router";
import { Component } from "@/pages/authentication/register";

export const Route = createLazyFileRoute("/auth/register")({
  component: Component
});
