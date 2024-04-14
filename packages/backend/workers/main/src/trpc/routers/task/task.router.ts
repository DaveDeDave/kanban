import { router } from "@/config/trpc.config";
import createTask from "./routes/createTask";
import deleteTask from "./routes/deleteTask";
import getTasksByColumn from "./routes/getTasksByColumn";
import updateTask from "./routes/updateTask";

export default router({
  createTask,
  deleteTask,
  getTasksByColumn,
  updateTask
});
