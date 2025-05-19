import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext, RouterInputs } from "../test.utility";
import { HttpNotFoundException } from "@kanban/base-lib";
import { Subtask } from "@prisma/client";

describe("Subtask router test", () => {
  let caller: Caller;
  let context: Context;
  const testUser = testData.users[0];
  const testTask = testData.tasks[0];
  let subtask: Subtask | null = null;

  beforeAll(async () => {
    context = await createContext({ headers: { Authorization: `Bearer ${testUser.jwt}` } });
    caller = createCaller(context);

    await loadTestData(context.prisma);
  });

  afterAll(async () => {
    await deleteTestData(context.prisma);
  });

  // createSubtask

  test("Should create a subtask", async () => {
    const createSubtaskInput: RouterInputs["subtask"]["createSubtask"] = {
      description: "New subtask description",
      taskId: testTask.id
    };
    const response = await caller.subtask.createSubtask(createSubtaskInput);
    subtask = response.createdSubtask;
    expect(response.createdSubtask.description).toBe(createSubtaskInput.description);
    expect(response.createdSubtask.completed).toBe(false);
    expect(response.createdSubtask.taskId).toBe(testTask.id);
  });

  // updateSubtask

  test("Should update the subtask", async () => {
    const updateSubtaskInput: RouterInputs["subtask"]["updateSubtask"] = {
      completed: true,
      description: "Updated subtask description",
      subtaskId: subtask!.id
    };
    const response = await caller.subtask.updateSubtask(updateSubtaskInput);
    subtask = response.updatedSubtask;
    expect(response.updatedSubtask.id).toBe(updateSubtaskInput.subtaskId);
    expect(response.updatedSubtask.description).toBe(updateSubtaskInput.description);
    expect(response.updatedSubtask.completed).toBe(updateSubtaskInput.completed);
    expect(response.updatedSubtask.taskId).toBe(testTask.id);
  });

  test("Should not update the subtask (not owned)", async () => {
    await expect(async () => {
      try {
        const updateSubtaskInput: RouterInputs["subtask"]["updateSubtask"] = {
          completed: true,
          description: "Updated subtask description",
          subtaskId: testData.subtasks[2].id
        };
        await caller.subtask.updateSubtask(updateSubtaskInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "SubtaskNotFound"
      })
    );
  });

  // deleteSubtask

  test("Should delete the subtask", async () => {
    const deleteSubtaskInput: RouterInputs["subtask"]["deleteSubtask"] = {
      subtaskId: subtask!.id
    };
    const response = await caller.subtask.deleteSubtask(deleteSubtaskInput);
    expect(response.deletedSubtask.id).toBe(subtask!.id);
    expect(response.deletedSubtask.description).toBe(subtask!.description);
    expect(response.deletedSubtask.completed).toBe(subtask!.completed);
    expect(response.deletedSubtask.taskId).toBe(subtask!.taskId);
    subtask = null;
  });

  test("Should not delete the subtask (not owned)", async () => {
    await expect(async () => {
      try {
        const deleteSubtaskInput: RouterInputs["subtask"]["deleteSubtask"] = {
          subtaskId: testData.subtasks[2].id
        };
        await caller.subtask.deleteSubtask(deleteSubtaskInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "SubtaskNotFound"
      })
    );
  });

  // getSubtasks

  test("Should get the subtasks by task id", async () => {
    const getSubtaskByBoardInput: RouterInputs["subtask"]["getSubtasks"] = {
      taskId: testTask.id
    };
    const response = await caller.subtask.getSubtasks(getSubtaskByBoardInput);
    expect(response.subtasks.length).toBe(2);
  });

  test("Should not get the subtasks by task id (not owned)", async () => {
    const getSubtaskByBoardInput: RouterInputs["subtask"]["getSubtasks"] = {
      taskId: testData.subtasks[2].id
    };
    const response = await caller.subtask.getSubtasks(getSubtaskByBoardInput);
    expect(response.subtasks.length).toBe(0);
  });
});
