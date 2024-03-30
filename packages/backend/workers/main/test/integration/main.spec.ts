import { deleteTestData, loadTestData } from "../test.data";
import { Caller, Context, createCaller, createContext } from "../test.utility";

describe("Root routes test", () => {
  let caller: Caller;
  let context: Context;

  beforeAll(async () => {
    context = await createContext();
    caller = createCaller(context);

    await loadTestData(context.prisma);
  });

  afterAll(async () => {
    await deleteTestData(context.prisma);
  });

  // healthcheck

  test("Should pass healthcheck", async () => {
    const response = await caller.healthcheck();
    expect(response).toEqual({ "worker-name": "main", status: "online" });
  });
});
