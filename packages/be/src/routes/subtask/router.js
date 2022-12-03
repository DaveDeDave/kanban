import { autheticated, validate } from "@kanban/lib/src/middleware";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createSubtask from "./endpoints/createSubtask";
import updateSubtask from "./endpoints/updateSubtask";
import deleteSubtask from "./endpoints/deleteSubtask";
import getAllSubtasks from "./endpoints/getAllSubtasks";

const subtaskRouter = Router({ base: "/v1/subtask" });
subtaskRouter.post(
  "/",
  withContent,
  autheticated,
  validate(createSubtask.schema),
  createSubtask.controller
);
subtaskRouter.patch(
  "/:id",
  withContent,
  autheticated,
  validate(updateSubtask.schema),
  updateSubtask.controller
);
subtaskRouter.delete("/:id", autheticated, deleteSubtask.controller);
subtaskRouter.get("/", autheticated, validate(getAllSubtasks.schema), getAllSubtasks.controller);

export default subtaskRouter;
