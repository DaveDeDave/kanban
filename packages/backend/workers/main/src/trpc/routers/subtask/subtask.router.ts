import { router } from "@/config/trpc.config";
import createSubtask from "./routes/create-subtask.route";
import deleteSubtask from "./routes/delete-subtask.route";
import getSubtasks from "./routes/get-subtasks-by-task.route";
import updateSubtask from "./routes/update-subtask.route";

export default router({
  createSubtask,
  deleteSubtask,
  getSubtasks,
  updateSubtask
});
