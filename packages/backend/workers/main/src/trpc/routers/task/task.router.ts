import { router } from "@/config/trpc.config";
import createTask from "./routes/create-task.route";
import deleteTask from "./routes/delete-task.route";
import getTasksByColumn from "./routes/get-tasks-by-column.route";
import updateTask from "./routes/update-task.route";
import rankTask from "./routes/rank-task.route";

export default router({
  createTask,
  deleteTask,
  getTasksByColumn,
  updateTask,
  rankTask
});
