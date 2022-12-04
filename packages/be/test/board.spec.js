import { mongoWrapper } from "@kanban/lib";
import ava from "ava";
import { Miniflare } from "miniflare";
import loadInput from "./inputs/loadInput.js";
import { data as boardData, token } from "./inputs/board.test.data.js";

const { before, after, serial: test } = ava;

globalThis.ENVIRONMENT = "Testing";
globalThis.MONGO_PROXY_BASE_URL = "http://localhost:7000";

let boardId;

before(async (t) => {
  const mf = new Miniflare({
    scriptPath: "./dist/index.js",
    wranglerConfigPath: "./local.toml",
    wranglerConfigEnv: "testing",
    buildCommand: ""
  });
  const db = await mongoWrapper.getInstance();
  await loadInput(db, boardData);
  t.context = { mf, db };
});

after.always(async (t) => {
  const { db } = t.context;
  await db.collection("user").deleteMany({});
  await db.collection("board").deleteMany({});
});

// POST /board

test("Should create a board", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/board", {
    method: "POST",
    body: JSON.stringify({
      name: "Another board"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.true(data.hasOwnProperty("insertedId"));
  const board = await db.collection("board").findOne({ _id: db.ObjectID(data.insertedId) });
  t.true(board !== null);
  boardId = data.insertedId;
});

// PATCH /board/:id

test("Should update the board", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/board/${boardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: "Renamed board"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const board = await db.collection("board").findOne({ _id: db.ObjectID(boardId) });
  t.true(board !== null);
  t.is(board.name, "Renamed board");
});

test("Should not update the board (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/board/${boardData.board[2]._id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: "Renamed board"
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 404);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_board");
});

// DELETE /board/:id

test("Should delete the board", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/board/${boardId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const board = await db.collection("board").findOne({ _id: db.ObjectID(boardId) });
  t.true(board === null);
});

test("Should not delete the board (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/board/${boardData.board[2]._id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 404);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_board");
});

// GET /board

test("Should get all the boards", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/board`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.is(data.length, 2);
});
