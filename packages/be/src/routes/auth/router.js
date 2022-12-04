import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import register from "./endpoints/register.js";
import login from "./endpoints/login.js";
import { validate } from "@kanban/lib/src/middleware.js";

const authRouter = Router({ base: "/v1/auth" });
authRouter.post("/register", withContent, validate(register.schema), register.controller);
authRouter.post("/login", withContent, validate(login.schema), login.controller);

export default authRouter;
