import { router } from "@/config/trpc.config";
import createTask from "./routes/create-task.route";
import deleteTask from "./routes/delete-task.route";
import getTasksByColumn from "./routes/get-tasks-by-column.route";
import updateTask from "./routes/update-task.route";
import sortTasks from "./routes/sort-tasks.route";
import moveTask from "./routes/move-task.route";

export default router({
  createTask,
  deleteTask,
  getTasksByColumn,
  updateTask,
  sortTasks,
  moveTask
});
