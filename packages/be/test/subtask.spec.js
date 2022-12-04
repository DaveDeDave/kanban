import { mongoWrapper } from "@kanban/lib";
import ava from "ava";
import { Miniflare } from "miniflare";
import { load, truncate } from "./inputs/setup.js";
import { data as inputData, token } from "./inputs/test.data.js";

const { before, after, serial: test } = ava;

globalThis.ENVIRONMENT = "Testing";
globalThis.MONGO_PROXY_BASE_URL = "http://localhost:7000";

let subtaskId;

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

// POST /subtask

test("Should create a subtask", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/subtask", {
    method: "POST",
    body: JSON.stringify({
      taskId: inputData.task[0]._id,
      description: "Another subtask description",
      completed: false
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.true(data.hasOwnProperty("insertedId"));
  const subtask = await db.collection("subtask").findOne({ _id: db.ObjectID(data.insertedId) });
  t.true(subtask !== null);
  subtaskId = data.insertedId;
});

// PATCH /subtask/:id

test("Should update the subtask", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/subtask/${subtaskId}`, {
    method: "PATCH",
    body: JSON.stringify({
      description: "Modified subtask description"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const subtask = await db.collection("subtask").findOne({ _id: db.ObjectID(subtaskId) });
  t.true(subtask !== null);
  t.is(subtask.description, "Modified subtask description");
  t.is(subtask.completed, false);
});

test("Should not update the subtask (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/subtask/${inputData.subtask[2]._id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        description: "Modified subtask description"
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 404);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_subtask");
});

// DELETE /subtask/:id

test("Should delete the subtask", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/subtask/${subtaskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const subtask = await db.collection("subtask").findOne({ _id: db.ObjectID(subtaskId) });
  t.true(subtask === null);
});

test("Should not delete the subtask (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/subtask/${inputData.subtask[2]._id}`,
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
  t.is(data.code, "error.doesnt_exist_subtask");
});

// GET /task

test("Should get all the subtasks", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/subtask?taskId=${inputData.task[0]._id}`,
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
