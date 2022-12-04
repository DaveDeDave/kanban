import { mongoWrapper } from "@kanban/lib";
import ava from "ava";
import { Miniflare } from "miniflare";

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
  t.context = { mf, db };
});

after.always(async (t) => {
  const { db } = t.context;
  await db.collection("user").deleteMany({});
});

test("Should create a user succesfully", async (t) => {
  const { mf, db } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "test@test.it",
      password: "Password12."
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.true(data.hasOwnProperty("token"));
  const user = await db.collection("user").findOne({ email: "test@test.it" });
  t.true(user !== null);
});

test("Should not create a user (email already exists)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "test@test.it",
      password: "Password12."
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 400);
  const data = await response.json();
  t.is(data.code, "error.already_exists_email");
});

test("Should not create a user (wrong format email)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "testtest.it",
      password: "Password12."
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 400);
  const data = await response.json();
  t.is(data.code, "error.wrong_format_email");
});

test("Should not create a user (password too weak)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "test1@test.it",
      password: "Password"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 400);
  const data = await response.json();
  t.is(data.code, "error.wrong_format_password");
});

test("Should authenticate the user", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "test@test.it",
      password: "Password12."
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 200);
  const data = await response.json();
  t.true(data.hasOwnProperty("token"));
});

test("Should not authenticate the user (wrong password)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "test@test.it",
      password: "Password"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 400);
  const data = await response.json();
  t.is(data.code, "error.wrong_password");
});

test("Should not authenticate the user (user doesn't exist)", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "test12@test.it",
      password: "Password"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  t.is(response.status, 400);
  const data = await response.json();
  t.is(data.code, "error.doesnt_exist_email");
});
