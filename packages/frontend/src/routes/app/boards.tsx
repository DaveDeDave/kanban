import { BoardsStructure } from "@/templates/boards-structure";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/boards")({
  component: BoardsStructure
});
