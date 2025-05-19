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
});
