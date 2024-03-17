import { router } from "@/trpc/init";
import createSubtask from "./routes/createSubtask";
import deleteSubtask from "./routes/deleteSubtask";
import getSubtasks from "./routes/getSubtasksByTask";
import updateSubtask from "./routes/updateSubtask";

export default router({
  createSubtask,
  deleteSubtask,
  getSubtasks,
  updateSubtask
});
