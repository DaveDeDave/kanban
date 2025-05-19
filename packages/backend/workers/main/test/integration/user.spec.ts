import { HttpUnauthorizedException } from "@kanban/base-lib";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext } from "../test.utility";
import { TRPCError } from "@trpc/server";

describe("User router test", () => {
  let caller: Caller;
  let context: Context;
  let authCaller: Caller;
  let authContext: Context;
  const testUser = testData.users[0];

  beforeAll(async () => {
    context = await createContext();
    caller = createCaller(context);
    authContext = await createContext({ headers: { Authorization: `Bearer ${testUser.jwt}` } });
    authCaller = createCaller(authContext);

    await loadTestData(context.prisma);
  });

  afterAll(async () => {
    await deleteTestData(context.prisma);
  });

  // deleteUser

  test("Should not delete the user (missing token)", async () => {
    await expect(async () => {
      try {
        await caller.user.deleteUser();
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpUnauthorizedException({
        errorCode: "MissingToken"
      })
    );
  });

  test("Should delete the user", async () => {
    const response = await authCaller.user.deleteUser();
    expect(response).toEqual({
      deletedUser: {
        id: testUser.id,
        email: testUser.email
      }
    });
  });

  test("Should not delete the user (invalid token, user has been deleted)", async () => {
    await expect(async () => {
      try {
        await authCaller.user.deleteUser();
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpUnauthorizedException({
        errorCode: "Unauthorized",
        message: "Unauthorized. User does not exists"
      })
    );
  });
});
