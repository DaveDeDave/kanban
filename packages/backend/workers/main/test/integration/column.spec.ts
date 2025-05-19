import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext, RouterInputs } from "../test.utility";
import { HttpNotFoundException } from "@kanban/base-lib";
import { Column } from "@prisma/client";

describe("Column router test", () => {
  let caller: Caller;
  let context: Context;
  const testUser = testData.users[0];
  const testBoard = testData.boards[0];
  let column: Column | null = null;

  beforeAll(async () => {
    context = await createContext({ headers: { Authorization: `Bearer ${testUser.jwt}` } });
    caller = createCaller(context);

    await loadTestData(context.prisma);
  });

  afterAll(async () => {
    await deleteTestData(context.prisma);
  });

  // createColumn

  test("Should create a column", async () => {
    const createColumnInput: RouterInputs["column"]["createColumn"] = {
      name: "New test column",
      color: "#ffffff",
      boardId: testBoard.id
    };
    const response = await caller.column.createColumn(createColumnInput);
    column = response.createdColumn;
    expect(response.createdColumn.name).toBe(createColumnInput.name);
    expect(response.createdColumn.color).toBe(createColumnInput.color);
    expect(response.createdColumn.boardId).toBe(testUser.id);
  });

  // updateColumn

  test("Should update the column", async () => {
    const updateColumnInput: RouterInputs["column"]["updateColumn"] = {
      name: "Updated test column",
      color: "#ffff00",
      columnId: column!.id
    };
    const response = await caller.column.updateColumn(updateColumnInput);
    column = response.updatedColumn;
    expect(response.updatedColumn.id).toBe(column.id);
    expect(response.updatedColumn.name).toBe(updateColumnInput.name);
    expect(response.updatedColumn.color).toBe(updateColumnInput.color);
    expect(response.updatedColumn.boardId).toBe(column.boardId);
  });

  test("Should not update the column (not owned)", async () => {
    await expect(async () => {
      try {
        const updateColumnInput: RouterInputs["column"]["updateColumn"] = {
          name: "Updated test column",
          color: "#ffff00",
          columnId: testData.columns[2].id
        };
        await caller.column.updateColumn(updateColumnInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "ColumnNotFound"
      })
    );
  });

  // deleteColumn

  test("Should delete the column", async () => {
    const deleteColumnInput: RouterInputs["column"]["deleteColumn"] = {
      columnId: column!.id
    };
    const response = await caller.column.deleteColumn(deleteColumnInput);
    expect(response.deletedColumn.id).toBe(deleteColumnInput.columnId);
    expect(response.deletedColumn.name).toBe(column!.name);
    expect(response.deletedColumn.color).toBe(column!.color);
    expect(response.deletedColumn.boardId).toBe(column!.boardId);
    column = null;
  });

  test("Should not delete the column (not owned)", async () => {
    await expect(async () => {
      try {
        const deleteColumnInput: RouterInputs["column"]["deleteColumn"] = {
          columnId: testData.columns[2].id
        };
        await caller.column.deleteColumn(deleteColumnInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "ColumnNotFound"
      })
    );
  });

  // getColumnsByBoard

  test("Should get the columns by board id", async () => {
    const getColumnByBoardInput: RouterInputs["column"]["getColumnsByBoard"] = {
      boardId: testData.boards[0].id
    };
    const response = await caller.column.getColumnsByBoard(getColumnByBoardInput);
    expect(response.columns.length).toBe(2);
  });

  test("Should not get the columns by board id (not owned)", async () => {
    const getColumnByBoardInput: RouterInputs["column"]["getColumnsByBoard"] = {
      boardId: testData.boards[2].id
    };
    const response = await caller.column.getColumnsByBoard(getColumnByBoardInput);
    expect(response.columns.length).toBe(0);
  });
});
