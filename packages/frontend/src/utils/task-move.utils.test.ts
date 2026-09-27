import { test, expect } from "vitest";
import { projectTaskMove, confirmTaskMove, resolveTaskMove } from "./task-move.utils";

type Board = Parameters<typeof projectTaskMove>[0];
type Task = Board["columns"][number]["tasks"][number];

const now = "2026-01-01T00:00:00.000Z";
const task = (id: string, columnId: string, rank: string): Task => ({
  id,
  title: id,
  description: "",
  columnId,
  rank,
  createdAt: now,
  updatedAt: now
});

const board = (): Board => ({
  id: "board",
  name: "Board",
  description: "",
  ownerId: "owner",
  createdAt: now,
  updatedAt: now,
  columns: [
    {
      id: "one",
      name: "One",
      color: "#ffffff",
      boardId: "board",
      rank: "1",
      createdAt: now,
      updatedAt: now,
      tasks: [task("a", "one", "1"), task("b", "one", "2"), task("c", "one", "3")]
    },
    {
      id: "two",
      name: "Two",
      color: "#ffffff",
      boardId: "board",
      rank: "2",
      createdAt: now,
      updatedAt: now,
      tasks: [task("d", "two", "1")]
    },
    {
      id: "empty",
      name: "Empty",
      color: "#ffffff",
      boardId: "board",
      rank: "3",
      createdAt: now,
      updatedAt: now,
      tasks: []
    }
  ]
});

const ids = (value: Board, columnId: string) =>
  value.columns.find(({ id }) => id === columnId)!.tasks.map(({ id }) => id);

test("moves a task across columns without duplication, including an empty column", () => {
  const moved = projectTaskMove(board(), {
    taskId: "b",
    targetColumnId: "two",
    previousTaskId: null,
    nextTaskId: "d"
  });
  expect(ids(moved, "one")).toEqual(["a", "c"]);
  expect(ids(moved, "two")).toEqual(["b", "d"]);
  expect(moved.columns[1].tasks[0].columnId).toBe("two");

  const empty = projectTaskMove(moved, {
    taskId: "b",
    targetColumnId: "empty",
    previousTaskId: null,
    nextTaskId: null
  });
  expect(ids(empty, "two")).toEqual(["d"]);
  expect(ids(empty, "empty")).toEqual(["b"]);
});

test("reorders in the same column and can apply the projection twice", () => {
  const move = {
    taskId: "a",
    targetColumnId: "one",
    previousTaskId: "c",
    nextTaskId: null
  };
  const moved = projectTaskMove(board(), move);
  expect(ids(moved, "one")).toEqual(["b", "c", "a"]);
  expect(ids(projectTaskMove(moved, move), "one")).toEqual(["b", "c", "a"]);
});

test("restores a moved task while preserving another task's edit", () => {
  const moved = projectTaskMove(board(), {
    taskId: "b",
    targetColumnId: "two",
    previousTaskId: "d",
    nextTaskId: null
  });
  const edited = {
    ...moved,
    columns: moved.columns.map((column) =>
      column.id === "two"
        ? {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === "d" ? { ...task, title: "edited" } : task
            )
          }
        : column
    )
  };
  const restored = projectTaskMove(edited, {
    taskId: "b",
    targetColumnId: "one",
    previousTaskId: "a",
    nextTaskId: "c"
  });
  expect(ids(restored, "one")).toEqual(["a", "b", "c"]);
  expect(restored.columns[1].tasks[0].title).toBe("edited");
});

test("confirmation updates rank without overwriting a concurrent title edit", () => {
  const edited = board();
  edited.columns[0].tasks[0].title = "new title";
  const confirmed = confirmTaskMove(edited, {
    ...edited.columns[0].tasks[0],
    rank: "4",
    title: "old title"
  });
  expect(confirmed.columns[0].tasks[0].rank).toBe("4");
  expect(confirmed.columns[0].tasks[0].title).toBe("new title");
});

test("resolves a queued move from the latest confirmed column and neighbors", () => {
  const first = projectTaskMove(board(), {
    taskId: "b",
    targetColumnId: "two",
    previousTaskId: "d",
    nextTaskId: null
  });
  expect(
    resolveTaskMove(first, {
      taskId: "b",
      targetColumnId: "one",
      previousTaskId: "a",
      nextTaskId: "c"
    })
  ).toEqual({
    columnId: "two",
    moveToColumnId: "one",
    taskId: "b",
    previousTaskId: "a",
    nextTaskId: "c"
  });
});

test("rebases a move when an original neighbor has disappeared", () => {
  const changed = board();
  changed.columns[0].tasks = changed.columns[0].tasks.filter((task) => task.id !== "c");
  expect(
    resolveTaskMove(changed, {
      taskId: "a",
      targetColumnId: "one",
      previousTaskId: "c",
      nextTaskId: null
    })
  ).toEqual({
    columnId: "one",
    moveToColumnId: null,
    taskId: "a",
    previousTaskId: null,
    nextTaskId: "b"
  });
});

test("replays rapid moves of the same task over a refreshed board", () => {
  const moves = [
    { taskId: "b", targetColumnId: "two", previousTaskId: "d", nextTaskId: null },
    { taskId: "b", targetColumnId: "empty", previousTaskId: null, nextTaskId: null },
    { taskId: "b", targetColumnId: "one", previousTaskId: "c", nextTaskId: null }
  ];
  const visible = moves.reduce(projectTaskMove, board());
  expect(ids(visible, "one")).toEqual(["a", "c", "b"]);
  expect(ids(visible, "two")).toEqual(["d"]);
  expect(ids(visible, "empty")).toEqual([]);

  const afterFirstSave = projectTaskMove(board(), moves[0]);
  const remaining = moves.slice(1).reduce(projectTaskMove, afterFirstSave);
  expect(ids(remaining, "one")).toEqual(ids(visible, "one"));
  expect(ids(remaining, "two")).toEqual(ids(visible, "two"));
});
