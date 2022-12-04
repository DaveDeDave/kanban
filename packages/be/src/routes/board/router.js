import { autheticated, validate } from "@kanban/lib/src/middleware.js";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createBoard from "./endpoints/createBoard.js";
import updateBoard from "./endpoints/updateBoard.js";
import deleteBoard from "./endpoints/deleteBoard.js";
import getAllBoards from "./endpoints/getAllBoards.js";

const boardRouter = Router({ base: "/v1/board" });
boardRouter.post(
  "/",
  withContent,
  autheticated,
  validate(createBoard.schema),
  createBoard.controller
);
boardRouter.patch(
  "/:id",
  withContent,
  autheticated,
  validate(updateBoard.schema),
  updateBoard.controller
);
boardRouter.delete("/:id", autheticated, deleteBoard.controller);
boardRouter.get("/", autheticated, getAllBoards.controller);

export default boardRouter;
