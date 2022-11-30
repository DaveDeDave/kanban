import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import register from "./endpoints/register";
import login from "./endpoints/login";

const authRouter = Router({ base: "/v1/auth" });
authRouter.post("/register", withContent, register);
authRouter.post("/login", withContent, login);

export default authRouter;
