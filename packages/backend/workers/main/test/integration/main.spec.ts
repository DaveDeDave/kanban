import { createFixture, type Fixture } from "../test.utility";
import { deleteTestData, loadTestData } from "../test.data";
import { Caller, Context, createCaller, createContext } from "../test.utility";

describe("Root routes test", () => {
  let caller: Caller;
  let context: Context;
  let fixture: Fixture;

  beforeAll(async () => {
    context = await createContext();
    caller = createCaller(context);

    fixture = createFixture();
    await loadTestData(fixture);
  });

  afterAll(async () => {
    await deleteTestData(fixture);
    await context.services.close();
    await fixture.close();
  });

  // healthcheck

  test("Should pass healthcheck", async () => {
    const response = await caller.healthcheck();
    expect(response).toEqual({ "worker-name": "main", status: "online" });
  });
});
