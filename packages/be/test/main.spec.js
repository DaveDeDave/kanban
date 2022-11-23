import { handle } from "../main.js";

test("test", async () => {
  const response = await handle(new Request("http://localhost/env"));
  const data = await response.json();
  expect(JSON.stringify(data)).toBe(JSON.stringify({ environment: "Testing" }));
});
