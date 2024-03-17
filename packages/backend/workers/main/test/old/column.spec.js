import { mongoWrapper } from "@kanban/lib";
import ava from "ava";
import { Miniflare } from "miniflare";
import { load, truncate } from "./inputs/setup.js";
import { data as inputData, token } from "./inputs/test.data.js";

const { before, after, serial: test } = ava;

globalThis.ENVIRONMENT = "Testing";
globalThis.MONGO_PROXY_BASE_URL = "http://localhost:7000";

let columnId;

before(async (t) => {
  const mf = new Miniflare({
    scriptPath: "./dist/index.js",
    wranglerConfigPath: "./local.toml",
    wranglerConfigEnv: "testing",
    buildCommand: ""
  });
  const db = await mongoWrapper.getInstance();
  await load(db, inputData);
  t.context = { mf, db };
});

after.always(async (t) => {
  const { db } = t.context;
  await truncate(db);
});

// POST /column

test("Should create a column", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/column", {
    method: "POST",
    body: JSON.stringify({
      boardId: inputData.board[0]._id,
      name: "Another column"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.true(data.hasOwnProperty("insertedId"));
  const column = await db.collection("column").findOne({ _id: db.ObjectID(data.insertedId) });
  t.true(column !== null);
  columnId = data.insertedId;
});

// PATCH /column/:id

test("Should update the column", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/column/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: "Renamed column"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const column = await db.collection("column").findOne({ _id: db.ObjectID(columnId) });
  t.true(column !== null);
  t.is(column.name, "Renamed column");
});

test("Should not update the column (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/column/${inputData.column[2]._id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: "Renamed column"
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 404);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_column");
});

// DELETE /column/:id

test("Should delete the column", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/column/${columnId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const column = await db.collection("column").findOne({ _id: db.ObjectID(columnId) });
  t.true(column === null);
});

test("Should not delete the column (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/column/${inputData.column[2]._id}`,
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
  t.is(data.code, "error.doesnt_exist_column");
});

// GET /column

test("Should get all the columns", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/column?boardId=${inputData.board[0]._id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 200);
  const data = await response.json();
  t.is(data.length, 2);
  t.false(data[0].hasOwnProperty("ownerId"));
});
