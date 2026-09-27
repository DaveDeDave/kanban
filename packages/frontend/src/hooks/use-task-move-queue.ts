import { trpc, type RouterOutputs } from "@/config/trpc.config";
import {
  confirmTaskMove,
  projectTaskMove,
  resolveTaskMove,
  type TaskMove
} from "@/utils/task-move.utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRankTask } from "@/hooks/trpc/board/rank-task.hook";

type Board = RouterOutputs["board"]["getBoardById"]["board"];

export const useTaskMoveQueue = (
  boardId: string,
  board: Board | undefined,
  refetch: () => Promise<{ data?: { board: Board }; isError: boolean }>
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
    current.onmessage = (event: MessageEvent<{ boardId?: string }>) => {
      if (event.data?.boardId === boardId && !processing.current && queue.current.length === 0) {
        void utils.board.getBoardById.invalidate(boardInput);
      }
    };
    return () => {
      current.close();
      if (channel.current === current) channel.current = null;
    };
  }, [boardId, boardInput, utils.board.getBoardById]);

  const processQueue = async () => {
    if (processing.current) return;
    processing.current = true;
    try {
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
            channel.current?.postMessage({ boardId });
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
    } finally {
      processing.current = false;
    }
  };

  const enqueue = (move: TaskMove) => {
    flushSync(() => {
      queue.current.push(move);
      setPending([...queue.current]);
      setMoveError(false);
    });
    void processQueue();
  };

  const retryLoad = async () => {
    const refreshed = await refetchRef.current().catch(() => null);
    if (refreshed && !refreshed.isError) {
      queue.current = [];
      setPending([]);
      setMoveError(false);
      setSyncBlocked(false);
    }
  };

  return { visibleBoard, pending, moveError, syncBlocked, enqueue, retryLoad };
};
