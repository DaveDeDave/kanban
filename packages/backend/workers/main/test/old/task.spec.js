import { mongoWrapper } from "@kanban/lib";
import ava from "ava";
import { Miniflare } from "miniflare";
import { load, truncate } from "./inputs/setup.js";
import { data as inputData, token } from "./inputs/test.data.js";

const { before, after, serial: test } = ava;

globalThis.ENVIRONMENT = "Testing";
globalThis.MONGO_PROXY_BASE_URL = "http://localhost:7000";

let taskId;

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

// POST /task

test("Should create a task", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/task", {
    method: "POST",
    body: JSON.stringify({
      columnId: inputData.column[0]._id,
      title: "Another task",
      description: "Another task description",
      status: "TODO"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.true(data.hasOwnProperty("insertedId"));
  const task = await db.collection("task").findOne({ _id: db.ObjectID(data.insertedId) });
  t.true(task !== null);
  taskId = data.insertedId;
});

// PATCH /task/:id

test("Should update the task", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/task/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: "Renamed task",
      status: "DOING"
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const task = await db.collection("task").findOne({ _id: db.ObjectID(taskId) });
  t.true(task !== null);
  t.is(task.title, "Renamed task");
  t.is(task.description, "Another task description");
  t.is(task.status, "DOING");
});

test("Should not update the task (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/task/${inputData.task[2]._id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: "Renamed task"
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 404);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_task");
});

// DELETE /task/:id

test("Should delete the task", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch(`http://localhost:8000/v1/task/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const task = await db.collection("task").findOne({ _id: db.ObjectID(taskId) });
  t.true(task === null);
});

test("Should not delete the task (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/task/${inputData.task[2]._id}`,
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
  t.is(data.code, "error.doesnt_exist_task");
});

// GET /task

test("Should get all the tasks", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/task?columnId=${inputData.column[0]._id}`,
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

// GET /task/:id

test("Should get the task", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/task/${inputData.task[0]._id}`,
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
  const expected = inputData.task[0];
  t.false(data.hasOwnProperty("ownerId"));
  t.is(data.boardId, expected.boardId);
  t.is(data.columnId, expected.columnId);
  t.is(data.title, expected.title);
  t.is(data.description, expected.description);
  t.is(data.status, expected.status);
});

test("Should not get the task (not owned)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch(
    `http://localhost:8000/v1/task/${inputData.task[2]._id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    }
  );
  t.is(response.status, 404);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_task");
});
