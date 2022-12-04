import { mongoWrapper } from "@kanban/lib";
import ava from "ava";
import { Miniflare } from "miniflare";
import { load, truncate } from "./inputs/setup.js";
import { data, token } from "./inputs/test.data.js";

const { before, after, serial: test } = ava;

globalThis.ENVIRONMENT = "Testing";
globalThis.MONGO_PROXY_BASE_URL = "http://localhost:7000";

before(async (t) => {
  const mf = new Miniflare({
    scriptPath: "./dist/index.js",
    wranglerConfigPath: "./local.toml",
    wranglerConfigEnv: "testing",
    buildCommand: ""
  });
  const db = await mongoWrapper.getInstance();
  await load(db, data);
  t.context = { mf, db };
});

after.always(async (t) => {
  const { db } = t.context;
  await truncate(db);
});

// DELETE /user

test("Should return 401 (without authorization token)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/user", {
    method: "DELETE"
  });
  t.is(response.status, 401);
});

test("Should delete the current user", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/user", {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 204);
  const user = await db.collection("user").findOne({ email: data.user[0].email });
  t.is(user, null);
});

test("Should return 401 (invalid token, user has been deleted)", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/user", {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  t.is(response.status, 401);
});
