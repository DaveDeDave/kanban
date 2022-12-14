import { autheticated, validate } from "@kanban/lib/src/middleware.js";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createTask from "./endpoints/createTask.js";
import updateTask from "./endpoints/updateTask.js";
import deleteTask from "./endpoints/deleteTask.js";
import getAllTasks from "./endpoints/getAllTasks.js";
import getTask from "./endpoints/getTask.js";

const taskRouter = Router({ base: "/v1/task" });
taskRouter.post("/", withContent, autheticated, validate(createTask.schema), createTask.controller);
taskRouter.patch(
  "/:id",
  withContent,
  autheticated,
  validate(updateTask.schema),
  updateTask.controller
);
taskRouter.delete("/:id", autheticated, deleteTask.controller);
taskRouter.get("/", autheticated, validate(getAllTasks.schema), getAllTasks.controller);
taskRouter.get("/:id", autheticated, getTask.controller);

export default taskRouter;
