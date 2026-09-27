import { trpc, type RouterOutputs } from "@/config/trpc.config";
import {
  confirmTaskMove,
  projectTaskMove,
  resolveTaskMove,
  type TaskMove
} from "@/utils/task-move.utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRankTask } from "@/hooks/trpc/board/rank-task.hook";
import {
  boardSyncSender,
  withBoardWriteLock,
  type BoardSyncActivity
} from "@/utils/board-sync.utils";
import type { MutableRefObject } from "react";

type Board = RouterOutputs["board"]["getBoardById"]["board"];

export const useTaskMoveQueue = (
  boardId: string,
  board: Board | undefined,
  refetch: () => Promise<{ data?: { board: Board }; isError: boolean }>,
  syncActivity: MutableRefObject<BoardSyncActivity>
) => {
  const utils = trpc.useUtils();
  const rankTask = useRankTask();
  const queue = useRef<TaskMove[]>([]);
  const processing = useRef(false);
  const channel = useRef<BroadcastChannel | null>(null);
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;
  const [pending, setPending] = useState<TaskMove[]>([]);
  const [moveError, setMoveError] = useState(false);
  const [syncBlocked, setSyncBlocked] = useState(false);
  const boardInput = useMemo(() => ({ boardId }), [boardId]);

  const visibleBoard = useMemo(
    () => (board ? pending.reduce(projectTaskMove, board) : undefined),
    [board, pending]
  );

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const current = new BroadcastChannel("kanban-board-moves");
    channel.current = current;
    current.onmessage = (event: MessageEvent<{ boardId?: string; sender?: string }>) => {
      if (
        event.data?.sender !== boardSyncSender &&
        event.data?.boardId === boardId &&
        !syncActivity.current.taskQueue &&
        !syncActivity.current.columnQueue
      ) {
        void utils.board.getBoardById.invalidate(boardInput);
      }
    };
    return () => {
      current.close();
      if (channel.current === current) channel.current = null;
    };
  }, [boardId, boardInput, syncActivity, utils.board.getBoardById]);

  const processQueue = async () => {
    if (processing.current) return;
    processing.current = true;
    syncActivity.current.taskQueue = true;
    try {
      await withBoardWriteLock(syncActivity.current, async () => {
        while (queue.current.length) {
          const move = queue.current[0];
          let saved = false;
          for (let attempt = 0; attempt < 3 && !saved; attempt++) {
            await utils.board.getBoardById.cancel(boardInput);
            const confirmed = utils.board.getBoardById.getData(boardInput)?.board;
            const input = confirmed && resolveTaskMove(confirmed, move);
            if (!input) break;
            try {
              const response = await rankTask.mutateAsync(input);
              utils.board.getBoardById.setData(boardInput, (old) =>
                old
                  ? { board: confirmTaskMove(projectTaskMove(old.board, move), response.task) }
                  : old
              );
              for (const columnId of new Set([input.columnId, response.task.columnId])) {
                void utils.task.getTasksByColumn.invalidate({ columnId });
              }
              channel.current?.postMessage({ boardId, sender: boardSyncSender });
              saved = true;
            } catch {
              const refreshed = await refetchRef.current().catch(() => null);
              if (!refreshed || refreshed.isError) break;
            }
          }
          if (!saved) {
            setMoveError(true);
            const refreshed = await refetchRef.current().catch(() => null);
            if (refreshed && !refreshed.isError) {
              queue.current = [];
              setPending([]);
              setSyncBlocked(false);
            } else {
              setSyncBlocked(true);
            }
            break;
          }
          queue.current.shift();
          setPending([...queue.current]);
          if (queue.current.length === 0) {
            // The mutation response confirmed the write. A failed follow-up read
            // must not prevent another drag on a slow connection.
            await refetchRef.current().catch(() => null);
          }
        }
      });
    } finally {
      processing.current = false;
      syncActivity.current.taskQueue = queue.current.length > 0;
    }
  };

  const enqueue = (move: TaskMove) => {
    syncActivity.current.taskQueue = true;
    flushSync(() => {
      queue.current.push(move);
      setPending([...queue.current]);
      setMoveError(false);
    });
    void processQueue();
  };

  const retryLoad = useCallback(async () => {
    await withBoardWriteLock(syncActivity.current, async () => {
      const refreshed = await refetchRef.current().catch(() => null);
      if (refreshed && !refreshed.isError) {
        queue.current = [];
        setPending([]);
        setMoveError(false);
        setSyncBlocked(false);
        syncActivity.current.taskQueue = false;
      }
    });
  }, [syncActivity]);

  useEffect(() => {
    if (!syncBlocked) return;
    let inFlight = false;
    const recover = () => {
      if (inFlight) return;
      inFlight = true;
      void retryLoad().finally(() => {
        inFlight = false;
      });
    };
    const timer = window.setInterval(recover, 5000);
    window.addEventListener("online", recover);
    window.addEventListener("focus", recover);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", recover);
      window.removeEventListener("focus", recover);
    };
  }, [retryLoad, syncBlocked]);

  return { visibleBoard, pending, moveError, syncBlocked, enqueue, retryLoad };
};
