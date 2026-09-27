import type { DatabaseClient, Executor } from "./types";
import { UserRepository } from "./user.repository";
import { BoardRepository } from "./board.repository";
import { ColumnRepository } from "./column.repository";
import { TaskRepository } from "./task.repository";
import { SubtaskRepository } from "./subtask.repository";

export const createRepositories = (db: Executor) => ({
  user: new UserRepository(db),
  board: new BoardRepository(db),
  column: new ColumnRepository(db),
  task: new TaskRepository(db),
  subtask: new SubtaskRepository(db)
});

export type Repositories = ReturnType<typeof createRepositories>;

export class UnitOfWork {
  constructor(private readonly db: DatabaseClient) {}

  transaction<T>(callback: (repositories: Repositories) => Promise<T>): Promise<T> {
    return this.db.transaction((tx) => callback(createRepositories(tx)));
  }
}
