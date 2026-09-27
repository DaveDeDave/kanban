// Shared by all board queues in this tab so their broadcasts do not refetch each other.
export const boardSyncSender = Math.random().toString(36).slice(2);

export interface BoardSyncActivity {
  taskQueue: boolean;
  columnQueue: boolean;
  writeTail?: Promise<void>;
}

// Keep writes and their reconciliation reads in order across the two queues.
// Drag intents can still be added to either queue while a write is in flight.
export const withBoardWriteLock = async <T>(
  activity: BoardSyncActivity,
  operation: () => Promise<T>
): Promise<T> => {
  const previous = activity.writeTail;
  let release = () => {};
  activity.writeTail = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;
  try {
    return await operation();
  } finally {
    release();
  }
};
