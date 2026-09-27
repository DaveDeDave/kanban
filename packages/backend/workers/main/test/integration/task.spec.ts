import { createFixture, type Fixture } from "../test.utility";
import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext, RouterInputs } from "../test.utility";
import { HttpNotFoundException } from "@kanban/base-lib";
import { tasks } from "../../src/db/tables";
type Task = typeof tasks.$inferSelect;

describe("Task router test", () => {
  let caller: Caller;
  let context: Context;
  let fixture: Fixture;
  const testUser = testData.users[0];
  const testColumn = testData.columns[0];
  let task: Task | null = null;

  beforeAll(async () => {
    context = await createContext({ headers: { Authorization: `Bearer ${testUser.jwt}` } });
    caller = createCaller(context);

    fixture = createFixture();
    await loadTestData(fixture);
  });

  afterAll(async () => {
    await deleteTestData(fixture);
    await context.services.close();
    await fixture.close();
  });

  // createTask

  test("Should create a task", async () => {
    const createTaskInput: RouterInputs["task"]["createTask"] = {
      title: "New task",
      description: "New task description",
      columnId: testColumn.id
    };
    const response = await caller.task.createTask(createTaskInput);
    task = response.createdTask;
    expect(response.createdTask.title).toBe(createTaskInput.title);
    expect(response.createdTask.description).toBe(createTaskInput.description);
    expect(response.createdTask.columnId).toBe(testColumn.id);
  });

  // updateTask

  test("Should update the task", async () => {
    const updateTaskInput: RouterInputs["task"]["updateTask"] = {
      title: "Updated task",
      description: "Updated task description",
      taskId: task!.id
    };
    const response = await caller.task.updateTask(updateTaskInput);
    task = response.updatedTask;
    expect(response.updatedTask.id).toBe(updateTaskInput.taskId);
    expect(response.updatedTask.title).toBe(updateTaskInput.title);
    expect(response.updatedTask.description).toBe(updateTaskInput.description);
    expect(response.updatedTask.columnId).toBe(testColumn.id);
  });

  test("Should not update the task (not owned)", async () => {
    await expect(async () => {
      try {
        const updateTaskInput: RouterInputs["task"]["updateTask"] = {
          title: "Updated task",
          description: "Updated task description",
          taskId: testData.tasks[2].id
        };
        await caller.task.updateTask(updateTaskInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "TaskNotFound"
      })
    );
  });

  // deleteTask

  test("Should delete the task", async () => {
    const deleteTaskInput: RouterInputs["task"]["deleteTask"] = {
      taskId: task!.id
    };
    const response = await caller.task.deleteTask(deleteTaskInput);
    expect(response.deletedTask.id).toBe(task!.id);
    expect(response.deletedTask.title).toBe(task!.title);
    expect(response.deletedTask.description).toBe(task!.description);
    expect(response.deletedTask.columnId).toBe(task!.columnId);
    task = null;
  });

  test("Should not delete the task (not owned)", async () => {
    await expect(async () => {
      try {
        const deleteTaskInput: RouterInputs["task"]["deleteTask"] = {
          taskId: testData.tasks[2].id
        };
        await caller.task.deleteTask(deleteTaskInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "TaskNotFound"
      })
    );
  });

  // getTasksByColumn

  test("Should get the tasks by column id", async () => {
    const getTaskByBoardInput: RouterInputs["task"]["getTasksByColumn"] = {
      columnId: testData.columns[0].id
    };
    const response = await caller.task.getTasksByColumn(getTaskByBoardInput);
    expect(response.tasks.length).toBe(2);
  });

  test("Should not get the tasks by column id (not owned)", async () => {
    const getTaskByBoardInput: RouterInputs["task"]["getTasksByColumn"] = {
      columnId: testData.columns[2].id
    };
    const response = await caller.task.getTasksByColumn(getTaskByBoardInput);
    expect(response.tasks.length).toBe(0);
  });

  test("Should move a task to another column and back in the requested order", async () => {
    const moved = await caller.task.rankTask({
      columnId: testData.columns[0].id,
      moveToColumnId: testData.columns[1].id,
      taskId: testData.tasks[0].id,
      previousTaskId: null,
      nextTaskId: null
    });
    expect(moved.task.columnId).toBe(testData.columns[1].id);

    const returned = await caller.task.rankTask({
      columnId: testData.columns[1].id,
      moveToColumnId: testData.columns[0].id,
      taskId: testData.tasks[0].id,
      previousTaskId: null,
      nextTaskId: testData.tasks[1].id
    });
    expect(returned.task.columnId).toBe(testData.columns[0].id);
    const source = await caller.task.getTasksByColumn({ columnId: testData.columns[0].id });
    expect(source.tasks.map(({ id }) => id)).toEqual([testData.tasks[0].id, testData.tasks[1].id]);
  });

  test("Should reorder tasks within their column", async () => {
    await caller.task.rankTask({
      columnId: testData.columns[0].id,
      taskId: testData.tasks[0].id,
      previousTaskId: testData.tasks[1].id,
      nextTaskId: null
    });
    const reordered = await caller.task.getTasksByColumn({ columnId: testData.columns[0].id });
    expect(reordered.tasks.map(({ id }) => id)).toEqual([
      testData.tasks[1].id,
      testData.tasks[0].id
    ]);

    await caller.task.rankTask({
      columnId: testData.columns[0].id,
      taskId: testData.tasks[0].id,
      previousTaskId: null,
      nextTaskId: testData.tasks[1].id
    });
  });

  test("Should reject stale neighbors without changing the task", async () => {
    await expect(
      caller.task.rankTask({
        columnId: testData.columns[0].id,
        moveToColumnId: testData.columns[1].id,
        taskId: testData.tasks[0].id,
        previousTaskId: testData.tasks[1].id,
        nextTaskId: null
      })
    ).rejects.toMatchObject({ code: "CONFLICT" });
    const task = await fixture.repositories.task.findOneById(testData.tasks[0].id );
    expect(task?.columnId).toBe(testData.columns[0].id);
  });

  test("Should serialize simultaneous moves into the same slot", async () => {
    const first = await caller.task.createTask({
      columnId: testData.columns[1].id,
      title: "Concurrent first",
      description: ""
    });
    const second = await caller.task.createTask({
      columnId: testData.columns[1].id,
      title: "Concurrent second",
      description: ""
    });
    try {
      const results = await Promise.allSettled(
        [first.createdTask.id, second.createdTask.id].map((taskId) =>
          caller.task.rankTask({
            columnId: testData.columns[1].id,
            moveToColumnId: testData.columns[0].id,
            taskId,
            previousTaskId: null,
            nextTaskId: testData.tasks[0].id
          })
        )
      );
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
      const board = await caller.board.getBoardById({ boardId: testData.boards[0].id });
      const destination = board.board.columns.find(({ id }) => id === testData.columns[0].id)!;
      const success = results.find((result) => result.status === "fulfilled");
      if (success?.status === "fulfilled") {
        expect(destination.tasks[0].id).toBe(success.value.task.id);
      }
    } finally {
      await caller.task.deleteTask({ taskId: first.createdTask.id });
      await caller.task.deleteTask({ taskId: second.createdTask.id });
    }
  });

  test("Should reject non-adjacent neighbors", async () => {
    const created = await caller.task.createTask({
      columnId: testData.columns[1].id,
      title: "Moving task",
      description: ""
    });
    try {
      await expect(
        caller.task.rankTask({
          columnId: testData.columns[1].id,
          moveToColumnId: testData.columns[0].id,
          taskId: created.createdTask.id,
          previousTaskId: null,
          nextTaskId: testData.tasks[1].id
        })
      ).rejects.toMatchObject({ code: "CONFLICT" });
      const unchanged = await fixture.repositories.task.findOneById(created.createdTask.id );
      expect(unchanged?.columnId).toBe(testData.columns[1].id);
    } finally {
      await caller.task.deleteTask({ taskId: created.createdTask.id });
    }
  });

  test("Should reject a destination on another board owned by the same user", async () => {
    const otherColumn = await caller.column.createColumn({
      boardId: testData.boards[1].id,
      name: "Other board column",
      color: "#ffffff"
    });
    await expect(
      caller.task.rankTask({
        columnId: testData.columns[0].id,
        moveToColumnId: otherColumn.createdColumn.id,
        taskId: testData.tasks[0].id,
        previousTaskId: null,
        nextTaskId: null
      })
    ).rejects.toThrow();
  });

  test("Should never write an empty rank when rank generation fails", async () => {
    const original = await fixture.repositories.task.findOneByIdOrThrow(testData.tasks[0].id );
    try {
      await fixture.repositories.task.updateByIdAndColumn(original.id, original.columnId, { rank: "invalid-rank" });
      await expect(
        caller.task.rankTask({
          columnId: testData.columns[0].id,
          taskId: testData.tasks[1].id,
          previousTaskId: null,
          nextTaskId: original.id
        })
      ).rejects.toMatchObject({ code: "CONFLICT" });
      const unchanged = await fixture.repositories.task.findOneByIdOrThrow(testData.tasks[1].id );
      expect(unchanged.rank).toBe(testData.tasks[1].rank);
    } finally {
      await fixture.repositories.task.updateByIdAndColumn(original.id, original.columnId, { rank: original.rank });
    }
  });
});
