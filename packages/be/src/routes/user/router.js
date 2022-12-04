import { Router } from "itty-router";
import { autheticated } from "@kanban/lib/src/middleware.js";
import deleteUser from "./endpoints/deleteUser.js";

const userRouter = Router({ base: "/v1/user" });
userRouter.delete("/", autheticated, deleteUser.controller);

export default userRouter;
