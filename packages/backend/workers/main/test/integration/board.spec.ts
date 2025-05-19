import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import {
  Caller,
  Context,
  createCaller,
  createContext,
  RouterInputs,
  RouterOutputs
} from "../test.utility";
import { HttpNotFoundException } from "@kanban/base-lib";
import { Board } from "@prisma/client";

describe("Board router test", () => {
  let caller: Caller;
  let context: Context;
  const testUser = testData.users[0];
  let board: Board | null = null;

  beforeAll(async () => {
    context = await createContext({ headers: { Authorization: `Bearer ${testUser.jwt}` } });
    caller = createCaller(context);

    await loadTestData(context.prisma);
  });

  afterAll(async () => {
    await deleteTestData(context.prisma);
  });

  // createBoard

  test("Should create a board", async () => {
    const createBoardInput: RouterInputs["board"]["createBoard"] = {
      name: "New test board",
      description: "New board description"
    };
    const response = await caller.board.createBoard(createBoardInput);
    board = response.createdBoard;
    expect(response.createdBoard.name).toBe(createBoardInput.name);
    expect(response.createdBoard.ownerId).toBe(testUser.id);
  });

  // updateBoard

  test("Should update the board", async () => {
    const updateBoardInput: RouterInputs["board"]["updateBoard"] = {
      name: "Updated test board",
      description: "Updated description",
      boardId: board!.id
    };
    const response = await caller.board.updateBoard(updateBoardInput);
    board = response.updatedBoard;
    expect(response.updatedBoard.id).toBe(updateBoardInput.boardId);
    expect(response.updatedBoard.name).toBe(updateBoardInput.name);
    expect(response.updatedBoard.ownerId).toBe(testUser.id);
  });

  test("Should not update the board (not owned)", async () => {
    await expect(async () => {
      try {
        const updateBoardInput: RouterInputs["board"]["updateBoard"] = {
          name: "Updated test board",
          description: "Updated description",
          boardId: testData.boards[2].id
        };
        await caller.board.updateBoard(updateBoardInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "BoardNotFound"
      })
    );
  });

  // deleteBoard

  test("Should delete the board", async () => {
    const deleteBoardInput: RouterInputs["board"]["deleteBoard"] = {
      boardId: board!.id
    };
    const response = await caller.board.deleteBoard(deleteBoardInput);
    expect(response.deletedBoard.id).toBe(deleteBoardInput.boardId);
    expect(response.deletedBoard.name).toBe(board!.name);
    expect(response.deletedBoard.ownerId).toBe(testUser.id);
    board = null;
  });

  test("Should not delete the board (not owned)", async () => {
    await expect(async () => {
      try {
        const deleteBoardInput: RouterInputs["board"]["deleteBoard"] = {
          boardId: testData.boards[2].id
        };
        await caller.board.deleteBoard(deleteBoardInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "BoardNotFound"
      })
    );
  });

  // getBoards

  test("Should get all the boards", async () => {
    const response = await caller.board.getBoards();
    expect(response.boards.length).toBe(2);
    board = null;
  });

  // getBoardById

  test("Should get the board by id", async () => {
    const getBoardByIdInput: RouterInputs["board"]["getBoardById"] = {
      boardId: testData.boards[0].id
    };
    const expectedBoard: RouterOutputs["board"]["getBoardById"]["board"] = {
      ...testData.boards[0],
      // @ts-ignore createdAt and updatedAt are of type Date
      columns: testData.columns
        .filter((column) => column.boardId === testData.boards[0].id)
        .map((column) => ({
          ...column,
          tasks: testData.tasks.filter((task) => task.columnId === column.id)
        }))
    };
    const response = await caller.board.getBoardById(getBoardByIdInput);

    expect(response.board).toEqual(expectedBoard);
  });

  test("Should not get the board by id (not owned)", async () => {
    await expect(async () => {
      try {
        const getBoardByIdInput: RouterInputs["board"]["getBoardById"] = {
          boardId: testData.boards[2].id
        };
        await caller.board.getBoardById(getBoardByIdInput);
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpNotFoundException({
        errorCode: "BoardNotFound"
      })
    );
  });
});
