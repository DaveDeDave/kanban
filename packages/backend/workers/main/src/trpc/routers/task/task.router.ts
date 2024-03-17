import { router } from "@/trpc/init";
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
