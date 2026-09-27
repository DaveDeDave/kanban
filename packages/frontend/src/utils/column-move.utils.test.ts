import { expect, test } from "vitest";
import { confirmColumnMove, projectColumnMove, resolveColumnMove } from "./column-move.utils";

type Board = Parameters<typeof projectColumnMove>[0];
const now = "2026-01-01T00:00:00.000Z";
const board = (): Board => ({
  id: "board",
  name: "Board",
  description: "",
  ownerId: "owner",
  createdAt: now,
  updatedAt: now,
  columns: ["a", "b", "c", "d"].map((id, index) => ({
    id,
    boardId: "board",
    name: id,
    color: "#fff",
    rank: String(index),
    createdAt: now,
    updatedAt: now,
    tasks: []
  }))
});
const ids = (value: Board) => value.columns.map(({ id }) => id);

test("replays consecutive column moves without duplication", () => {
  const first = { columnId: "a", previousColumnId: "c", nextColumnId: "d" };
  const second = { columnId: "b", previousColumnId: "d", nextColumnId: null };
  const moved = projectColumnMove(projectColumnMove(board(), first), second);
  expect(ids(moved)).toEqual(["c", "a", "d", "b"]);
  expect(ids(projectColumnMove(moved, second))).toEqual(ids(moved));
});

test("resolves a queued move from the latest confirmed order", () => {
  const saved = projectColumnMove(board(), {
    columnId: "a",
    previousColumnId: "c",
    nextColumnId: "d"
  });
  expect(
    resolveColumnMove(saved, {
      columnId: "a",
      previousColumnId: "d",
      nextColumnId: null
    })
  ).toEqual({
    boardId: "board",
    columnId: "a",
    previousColumnId: "d",
    nextColumnId: null
  });
});

test("confirmation keeps a concurrent column edit", () => {
  const edited = board();
  edited.columns[0].name = "Renamed";
  const saved = { ...edited.columns[0], name: "Old", rank: "new" };
  const confirmed = confirmColumnMove(edited, saved);
  expect(confirmed.columns[0].name).toBe("Renamed");
  expect(confirmed.columns[0].rank).toBe("new");
});
