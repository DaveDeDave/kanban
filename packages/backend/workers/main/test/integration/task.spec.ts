import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext, RouterInputs } from "../test.utility";
import { HttpNotFoundException } from "@kanban/base-lib";
import { Task } from "@prisma/client";

describe("Task router test", () => {
  let caller: Caller;
  let context: Context;
  const testUser = testData.users[0];
  const testColumn = testData.columns[0];
  let task: Task | null = null;

  beforeAll(async () => {
    context = await createContext({ headers: { Authorization: `Bearer ${testUser.jwt}` } });
    caller = createCaller(context);

    await loadTestData(context.prisma);
  });

  afterAll(async () => {
    await deleteTestData(context.prisma);
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
    expect(reordered.tasks.map(({ id }) => id)).toEqual([testData.tasks[1].id, testData.tasks[0].id]);

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
    const task = await context.prisma.task.findUnique({ where: { id: testData.tasks[0].id } });
    expect(task?.columnId).toBe(testData.columns[0].id);
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
      const unchanged = await context.prisma.task.findUnique({
        where: { id: created.createdTask.id }
      });
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
    const original = await context.prisma.task.findUniqueOrThrow({
      where: { id: testData.tasks[0].id }
    });
    try {
      await context.prisma.task.update({
        where: { id: original.id },
        data: { rank: "invalid-rank" }
      });
      await expect(
        caller.task.rankTask({
          columnId: testData.columns[0].id,
          taskId: testData.tasks[1].id,
          previousTaskId: null,
          nextTaskId: original.id
        })
      ).rejects.toMatchObject({ code: "CONFLICT" });
      const unchanged = await context.prisma.task.findUniqueOrThrow({
        where: { id: testData.tasks[1].id }
      });
      expect(unchanged.rank).toBe(testData.tasks[1].rank);
    } finally {
      await context.prisma.task.update({
        where: { id: original.id },
        data: { rank: original.rank }
      });
    }
  });
});
