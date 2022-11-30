import { autheticated } from "@kanban/lib/src/middleware";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createColumn from "./endpoints/createColumn";
import updateColumn from "./endpoints/updateColumn";
import deleteColumn from "./endpoints/deleteColumn";
import getAllColumns from "./endpoints/getAllColumns";

const columnRouter = Router({ base: "/v1/column" });
columnRouter.post("/", withContent, autheticated, createColumn);
columnRouter.patch("/:id", withContent, autheticated, updateColumn);
columnRouter.delete("/:id", autheticated, deleteColumn);
columnRouter.get("/", autheticated, getAllColumns);

export default columnRouter;
