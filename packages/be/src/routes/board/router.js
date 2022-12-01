import { autheticated } from "@kanban/lib/src/middleware";
import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import createBoard from "./endpoints/createBoard";
import updateBoard from "./endpoints/updateBoard";
import deleteBoard from "./endpoints/deleteBoard";
import getAllBoards from "./endpoints/getAllBoards";

const boardRouter = Router({ base: "/v1/board" });
boardRouter.post("/", withContent, autheticated, createBoard);
boardRouter.patch("/:id", withContent, autheticated, updateBoard);
boardRouter.delete("/:id", autheticated, deleteBoard);
boardRouter.get("/", autheticated, getAllBoards);

export default boardRouter;
