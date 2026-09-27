import { createFixture, type Fixture } from "../test.utility";
import { TRPCError } from "@trpc/server";
import { deleteTestData, loadTestData, testData } from "../test.data";
import { Caller, Context, createCaller, createContext } from "../test.utility";
import { HttpUnauthorizedException } from "@kanban/base-lib";
import { HttpBadRequestException } from "@kanban/base-lib/src/exceptions/http/bad-request/bad-request";

describe("Authentication router test", () => {
  let caller: Caller;
  let context: Context;
  let fixture: Fixture;
  const testUser = testData.users[0];

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

  // register

  test("Should create a user", async () => {
    const response = await caller.authentication.register({
      email: "new.user@example.com",
      password: "Password12."
    });

    expect(response.token).not.toBeNull();
  });

  test("Should not create a user (email already exists - case sensitive)", async () => {
    await expect(async () => {
      try {
        await caller.authentication.register({
          email: "new.USER@example.com",
          password: "Password12."
        });
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpBadRequestException({
        errorCode: "EmailAlreadyExists"
      })
    );
  });

  test("Should not create a user (email already exists)", async () => {
    await expect(async () => {
      try {
        await caller.authentication.register({
          email: "new.user@example.com",
          password: "Password12."
        });
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpBadRequestException({
        errorCode: "EmailAlreadyExists"
      })
    );
  });

  test("Should not create a user (password too weak)", async () => {
    await expect(
      caller.authentication.register({
        email: "new.user@example.com",
        password: "Password12."
      })
    ).rejects.toThrow(TRPCError);
  });

  // login

  test("Should authenticate the user", async () => {
    const response = await caller.authentication.login({
      email: testUser.email,
      password: testUser.plainPassword
    });

    expect(response.token).not.toBeNull();
  });

  test("Should authenticate the user (case sensitive)", async () => {
    const response = await caller.authentication.login({
      email: testUser.email.toUpperCase(),
      password: testUser.plainPassword
    });

    expect(response.token).not.toBeNull();
  });

  test("Should not authenticate the user (wrong password)", async () => {
    await expect(async () => {
      try {
        await caller.authentication.login({
          email: testUser.email.toUpperCase(),
          password: "wrongPassword"
        });
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpUnauthorizedException({
        errorCode: "WrongCredentials"
      })
    );
  });

  test("Should not authenticate the user (user doesn't exist)", async () => {
    await expect(async () => {
      try {
        await caller.authentication.login({
          email: "wrong.email@example.com",
          password: "wrongPassword"
        });
      } catch (e) {
        expect(e).toBeInstanceOf(TRPCError);
        throw (e as TRPCError).cause;
      }
    }).rejects.toThrow(
      new HttpUnauthorizedException({
        errorCode: "WrongCredentials"
      })
    );
  });
});
