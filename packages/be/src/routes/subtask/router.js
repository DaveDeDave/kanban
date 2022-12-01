import { autheticated } from "@kanban/lib/src/middleware";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createSubtask from "./endpoints/createSubtask";
import updateSubtask from "./endpoints/updateSubtask";
import deleteSubtask from "./endpoints/deleteSubtask";
import getAllSubtasks from "./endpoints/getAllSubtasks";

const subtaskRouter = Router({ base: "/v1/subtask" });
subtaskRouter.post("/", withContent, autheticated, createSubtask);
subtaskRouter.patch("/:id", withContent, autheticated, updateSubtask);
subtaskRouter.delete("/:id", autheticated, deleteSubtask);
subtaskRouter.get("/", autheticated, getAllSubtasks);

export default subtaskRouter;
