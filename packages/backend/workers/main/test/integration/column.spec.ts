import { createFixture, type Fixture } from "../test.utility";
import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext, RouterInputs } from "../test.utility";
import { HttpNotFoundException } from "@kanban/base-lib";
import { columns } from "../../src/db/tables";
type Column = typeof columns.$inferSelect;

describe("Column router test", () => {
  let caller: Caller;
  let context: Context;
  let fixture: Fixture;
  const testUser = testData.users[0];
  const testBoard = testData.boards[0];
  let column: Column | null = null;

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

  test("Should reorder columns and reject stale neighbors", async () => {
    await caller.column.rankColumn({
      boardId: testBoard.id,
      columnId: testData.columns[0].id,
      previousColumnId: testData.columns[1].id,
      nextColumnId: null
    });
    const reordered = await caller.board.getBoardById({ boardId: testBoard.id });
    expect(reordered.board.columns.map(({ id }) => id)).toEqual([
      testData.columns[1].id,
      testData.columns[0].id
    ]);
    await expect(
      caller.column.rankColumn({
        boardId: testBoard.id,
        columnId: testData.columns[0].id,
        previousColumnId: null,
        nextColumnId: null
      })
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await caller.column.rankColumn({
      boardId: testBoard.id,
      columnId: testData.columns[0].id,
      previousColumnId: null,
      nextColumnId: testData.columns[1].id
    });
  });

  test("Should serialize simultaneous column moves into the same slot", async () => {
    const first = await caller.column.createColumn({
      boardId: testBoard.id,
      name: "Concurrent first",
      color: "#ffffff"
    });
    const second = await caller.column.createColumn({
      boardId: testBoard.id,
      name: "Concurrent second",
      color: "#ffffff"
    });
    try {
      const results = await Promise.allSettled(
        [first.createdColumn.id, second.createdColumn.id].map((columnId) =>
          caller.column.rankColumn({
            boardId: testBoard.id,
            columnId,
            previousColumnId: null,
            nextColumnId: testData.columns[0].id
          })
        )
      );
      expect(results.filter(({ status }) => status === "fulfilled")).toHaveLength(1);
      expect(results.filter(({ status }) => status === "rejected")).toHaveLength(1);
    } finally {
      await caller.column.deleteColumn({ columnId: first.createdColumn.id });
      await caller.column.deleteColumn({ columnId: second.createdColumn.id });
    }
  });

  test("Should not write an empty rank when rank generation fails", async () => {
    const original = await fixture.repositories.column.findOneByIdOrThrow(testData.columns[0].id);
    const moving = await fixture.repositories.column.findOneByIdOrThrow(testData.columns[1].id);
    try {
      await fixture.repositories.column.updateRank(original.id, original.boardId, "invalid-rank");
      await expect(
        caller.column.rankColumn({
          boardId: testBoard.id,
          columnId: moving.id,
          previousColumnId: original.id,
          nextColumnId: null
        })
      ).rejects.toMatchObject({ code: "CONFLICT" });
      const unchanged = await fixture.repositories.column.findOneByIdOrThrow(moving.id);
      expect(unchanged.rank).toBe(moving.rank);
    } finally {
      await fixture.repositories.column.updateRank(original.id, original.boardId, original.rank);
    }
  });
});
