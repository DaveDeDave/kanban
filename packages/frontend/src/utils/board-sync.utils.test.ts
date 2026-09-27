import { describe, expect, it } from "vitest";
import { withBoardWriteLock, type BoardSyncActivity } from "./board-sync.utils";

describe("withBoardWriteLock", () => {
  it("runs writes in order and releases the next write after an error", async () => {
    const activity: BoardSyncActivity = { taskQueue: false, columnQueue: false };
    const order: string[] = [];
    let finishFirst = () => {};
    const first = withBoardWriteLock(activity, async () => {
      order.push("first start");
      await new Promise<void>((resolve) => {
        finishFirst = resolve;
      });
      order.push("first end");
      throw new Error("write failed");
    });
    const second = withBoardWriteLock(activity, async () => {
      order.push("second start");
    });

    await Promise.resolve();
    expect(order).toEqual(["first start"]);
    finishFirst();
    await expect(first).rejects.toThrow("write failed");
    await second;
    expect(order).toEqual(["first start", "first end", "second start"]);
  });
});
