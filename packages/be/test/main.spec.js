import test from "ava";
import { Miniflare } from "miniflare";

test.before((t) => {
  const mf = new Miniflare({
    scriptPath: "./dist/index.js",
    wranglerConfigPath: "./local.toml",
    wranglerConfigEnv: "testing"
  });
  t.context = { mf };
});

test("test", async (t) => {
  const { mf } = t.context;
  const response = await mf.dispatchFetch("http://localhost:8000/v1/healthcheck");
  const data = await response.json();
  t.is(JSON.stringify(data), JSON.stringify({ "worker-name": "be", environment: "Testing" }));
});
