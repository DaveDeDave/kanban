import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/pages/app/board";

export const Route = createFileRoute("/app/boards/$boardId")({
  component: Component
});
