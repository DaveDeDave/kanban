import { getDatabase } from "@/config/db.config";
import { getJwtHelper } from "@kanban/base-lib";
import { createRepositories, UnitOfWork } from "@/repositories/unit-of-work";
import { AuthenticationService } from "./authentication.service";
import { BoardService } from "./board.service";
import { ColumnService } from "./column.service";
import { SubtaskService } from "./subtask.service";
import { TaskService } from "./task.service";
import { UserService } from "./user.service";

export async function createServices(connectionString: string, jwtSecret: string) {
  const { db, pool } = getDatabase(connectionString);
  const repositories = createRepositories(db);
  const unitOfWork = new UnitOfWork(db);
  const user = new UserService(repositories.user);
  const jwt = await getJwtHelper(jwtSecret);
  return {
    authentication: new AuthenticationService(repositories.user, user, jwt),
    user,
    board: new BoardService(repositories.board, repositories.column, repositories.task),
    column: new ColumnService(repositories.board, repositories.column, unitOfWork),
    task: new TaskService(repositories.column, repositories.task, repositories.subtask, unitOfWork),
    subtask: new SubtaskService(repositories.task, repositories.subtask),
    close: () => pool.end()
  };
}

export type Services = Awaited<ReturnType<typeof createServices>>;
