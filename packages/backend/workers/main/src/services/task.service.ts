import { HttpNotFoundException } from "@kanban/base-lib";
import { TRPCError } from "@trpc/server";
import { LexoRank } from "lexorank";
import { ColumnRepository } from "@/repositories/column.repository";
import { TaskRepository } from "@/repositories/task.repository";
import { SubtaskRepository } from "@/repositories/subtask.repository";
import { UnitOfWork } from "@/repositories/unit-of-work";

export class TaskService {
  constructor(private readonly columns: ColumnRepository, private readonly tasks: TaskRepository, private readonly subtasks: SubtaskRepository, private readonly unitOfWork: UnitOfWork) {}

  async createTask(input: { title: string; description: string; columnId: string }, ownerId: string) {
    const existing = await this.columns.findOneByIdAndOwner(input.columnId, ownerId);
    if (!existing) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
    return this.unitOfWork.transaction(async ({ board, column, task }) => {
      await board.lockById(existing.boardId);
      const current = await column.findOneById(input.columnId);
      if (!current || current.boardId !== existing.boardId) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
      const first = await task.findFirstByColumn(input.columnId);
      const rank = first ? LexoRank.parse(first.rank).genPrev().toString() : LexoRank.middle().toString();
      const createdTask = await task.create({ ...input, rank });
      return { createdTask: { ...createdTask, boardId: existing.boardId } };
    });
  }

  async updateTask(input: { taskId: string; title?: string; description?: string }, ownerId: string) {
    const existing = await this.tasks.findOneByIdAndOwner(input.taskId, ownerId);
    if (!existing) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
    const column = await this.columns.findOneById(existing.columnId);
    const updated = await this.tasks.updateByIdAndOwner(input.taskId, ownerId, { title: input.title, description: input.description });
    if (!updated || !column) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
    return { updatedTask: { ...updated, boardId: column.boardId } };
  }

  async deleteTask(taskId: string, ownerId: string) {
    const existing = await this.tasks.findOneByIdAndOwner(taskId, ownerId);
    if (!existing) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
    const column = await this.columns.findOneById(existing.columnId);
    if (!column) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
    return this.unitOfWork.transaction(async ({ board, task }) => {
      await board.lockById(column.boardId);
      const deleted = await task.deleteByIdAndOwner(taskId, ownerId);
      if (!deleted) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
      return { deletedTask: { ...deleted, boardId: column.boardId } };
    });
  }

  async getTaskById(taskId: string, ownerId: string) {
    const task = await this.tasks.findOneByIdAndOwner(taskId, ownerId);
    if (!task) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
    return { task: { ...task, subtasks: await this.subtasks.findManyByTask(taskId) } };
  }

  async getTasksByColumn(columnId: string, ownerId: string) {
    return { tasks: await this.tasks.findManyByColumnAndOwner(columnId, ownerId) };
  }

  async rankTask(input: { columnId: string; moveToColumnId?: string | null; taskId: string; previousTaskId: string | null; nextTaskId: string | null }, ownerId: string) {
    const { columnId, moveToColumnId, taskId, previousTaskId, nextTaskId } = input;
    const source = await this.columns.findOneByIdAndOwner(columnId, ownerId);
    if (!source) throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
    return this.unitOfWork.transaction(async ({ board, column, task }) => {
      await board.lockById(source.boardId);
      const currentSource = await column.findOneById(columnId);
      const destination = moveToColumnId ? await column.findOneByIdAndOwner(moveToColumnId, ownerId) : null;
      const targetColumnId = moveToColumnId ?? columnId;
      if (!currentSource || currentSource.boardId !== source.boardId || (moveToColumnId && (!destination || destination.boardId !== source.boardId))) {
        throw new HttpNotFoundException({ errorCode: "ColumnNotFound" });
      }
      if (!(await task.findOneByIdAndColumn(taskId, columnId))) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
      const neighborIds = [previousTaskId, nextTaskId].filter((id): id is string => !!id);
      const neighbors = await task.findNeighbors(targetColumnId, neighborIds);
      const previous = neighbors.find(({ id }) => id === previousTaskId);
      const next = neighbors.find(({ id }) => id === nextTaskId);
      if ((previousTaskId && !previous) || (nextTaskId && !next) || (previous && next && previous.rank >= next.rank)) {
        throw new TRPCError({ code: "CONFLICT", message: "Task order has changed" });
      }
      const between = await task.findBetween(targetColumnId, [taskId, ...neighborIds], previous?.rank, next?.rank);
      if (between) throw new TRPCError({ code: "CONFLICT", message: "Task order has changed" });
      let rank: string;
      try {
        if (previous && next) rank = LexoRank.parse(previous.rank).between(LexoRank.parse(next.rank)).toString();
        else if (previous) rank = LexoRank.parse(previous.rank).genNext().toString();
        else if (next) rank = LexoRank.parse(next.rank).genPrev().toString();
        else rank = LexoRank.middle().toString();
      } catch {
        throw new TRPCError({ code: "CONFLICT", message: "Task rank cannot be calculated" });
      }
      const updated = await task.updateByIdAndColumn(taskId, columnId, { rank, columnId: destination?.id });
      if (!updated) throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
      return { columnId, task: updated };
    });
  }
}
