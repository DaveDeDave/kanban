import { handle } from "../main.js";

test("test", async () => {
  const response = await handle(new Request("http://localhost/v1/healthcheck"));
  const data = await response.json();
  expect(JSON.stringify(data)).toBe(JSON.stringify({ "worker-name": "be", environment: "Testing" }));
});
