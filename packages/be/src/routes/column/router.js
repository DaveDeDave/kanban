import { autheticated, validate } from "@kanban/lib/src/middleware.js";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createColumn from "./endpoints/createColumn.js";
import updateColumn from "./endpoints/updateColumn.js";
import deleteColumn from "./endpoints/deleteColumn.js";
import getAllColumns from "./endpoints/getAllColumns.js";

const columnRouter = Router({ base: "/v1/column" });
columnRouter.post(
  "/",
  withContent,
  autheticated,
  validate(createColumn.schema),
  createColumn.controller
);
columnRouter.patch(
  "/:id",
  withContent,
  autheticated,
  validate(updateColumn.schema),
  updateColumn.controller
);
columnRouter.delete("/:id", autheticated, deleteColumn.controller);
columnRouter.get("/", autheticated, validate(getAllColumns.schema), getAllColumns.controller);

export default columnRouter;
