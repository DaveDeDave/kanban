import { autheticated } from "@kanban/lib/src/middleware";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createTask from "./endpoints/createTask";
import updateTask from "./endpoints/updateTask";
import deleteTask from "./endpoints/deleteTask";
import getAllTasks from "./endpoints/getAllTasks";
import getTask from "./endpoints/getTask";

const taskRouter = Router({ base: "/v1/task" });
taskRouter.post("/", withContent, autheticated, createTask);
taskRouter.patch("/:id", withContent, autheticated, updateTask);
taskRouter.delete("/:id", autheticated, deleteTask);
taskRouter.get("/", autheticated, getAllTasks);
taskRouter.get("/:id", autheticated, getTask);

export default taskRouter;
