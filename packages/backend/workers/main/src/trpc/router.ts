import { router } from "./init";
import authenticationRouter from "./routers/authentication/authentication.router";
import boardRouter from "./routers/board/board.router";
import columnRouter from "./routers/column/column.router";
import subtaskRouter from "./routers/subtask/subtask.router";
import taskRouter from "./routers/task/task.router";
import userRouter from "./routers/user/user.router";
import healthcheckRoute from "./routes/healthcheck.route";

export const appRouter = router({
  authentication: authenticationRouter,
  board: boardRouter,
  column: columnRouter,
  task: taskRouter,
  subtask: subtaskRouter,
  user: userRouter,
  healthcheck: healthcheckRoute
});

export type AppRouter = typeof appRouter;
