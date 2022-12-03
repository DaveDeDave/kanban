import { Router } from "itty-router";
import { autheticated } from "@kanban/lib/src/middleware";
import deleteUser from "./endpoints/deleteUser";

const userRouter = Router({ base: "/v1/user" });
userRouter.delete("/", autheticated, deleteUser.controller);

export default userRouter;
