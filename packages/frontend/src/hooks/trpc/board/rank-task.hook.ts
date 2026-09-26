import { trpc } from "@/config/trpc.config";
import { projectTaskMove, confirmTaskMove, TaskMove } from "@/utils/task-move.utils";

export const useRankTask = ({ boardId }: { boardId: string }) => {
  const utils = trpc.useUtils();
  const boardInput = { boardId };

  return trpc.task.rankTask.useMutation({
    onMutate: async (input) => {
      const targetColumnId = input.moveToColumnId ?? input.columnId;
      await Promise.all([
        utils.board.getBoardById.cancel(boardInput),
        utils.task.getTasksByColumn.cancel({ columnId: input.columnId }),
        utils.task.getTasksByColumn.cancel({ columnId: targetColumnId })
      ]);

      const board = utils.board.getBoardById.getData(boardInput)?.board;
      const sourceTasks = board?.columns.find(({ id }) => id === input.columnId)?.tasks ?? [];
      const oldIndex = sourceTasks.findIndex(({ id }) => id === input.taskId);
      const rollback: TaskMove = {
        taskId: input.taskId,
        targetColumnId: input.columnId,
        previousTaskId: sourceTasks[oldIndex - 1]?.id ?? null,
        nextTaskId: sourceTasks[oldIndex + 1]?.id ?? null
      };
      const move: TaskMove = {
        taskId: input.taskId,
        targetColumnId,
        previousTaskId: input.previousTaskId,
        nextTaskId: input.nextTaskId
      };

      utils.board.getBoardById.setData(boardInput, (old) =>
        old ? { board: projectTaskMove(old.board, move) } : old
      );
      return { rollback };
    },
    onSuccess: (response, input) => {
      utils.board.getBoardById.setData(boardInput, (old) =>
        old ? { board: confirmTaskMove(old.board, response.task) } : old
      );
      const confirmedTask =
        utils.board.getBoardById
          .getData(boardInput)
          ?.board.columns.flatMap((column) => column.tasks)
          .find(({ id }) => id === response.task.id) ?? response.task;
      for (const columnId of new Set([input.columnId, response.task.columnId])) {
        utils.task.getTasksByColumn.setData({ columnId }, (old) => {
          if (!old) return old;
          const tasks = old.tasks.filter(({ id }) => id !== response.task.id);
          if (columnId === response.task.columnId) {
            tasks.push(confirmedTask);
            tasks.sort(
              (a, b) => a.rank.localeCompare(b.rank) || a.createdAt.localeCompare(b.createdAt)
            );
          }
          return { tasks };
        });
      }
    },
    onError: (_error, input, context) => {
      if (context?.rollback) {
        utils.board.getBoardById.setData(boardInput, (old) =>
          old ? { board: projectTaskMove(old.board, context.rollback) } : old
        );
      }
      const targetColumnId = input.moveToColumnId ?? input.columnId;
      void utils.task.getTasksByColumn.invalidate({ columnId: input.columnId });
      if (targetColumnId !== input.columnId) {
        void utils.task.getTasksByColumn.invalidate({ columnId: targetColumnId });
      }
    },
    onSettled: (_response, error, input) => {
      if (!error) {
        const boardRefetch = utils.board.getBoardById.invalidate(boardInput);
        void utils.task.getTasksByColumn.invalidate({ columnId: input.columnId });
        if (input.moveToColumnId && input.moveToColumnId !== input.columnId) {
          void utils.task.getTasksByColumn.invalidate({ columnId: input.moveToColumnId });
        }
        return boardRefetch;
      }
    }
  });
};
