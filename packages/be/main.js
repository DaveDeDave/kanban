import { Router } from "itty-router";
import { json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";
import { mongoWrapper } from "@kanban/lib";
import authRouter from "./routes/auth/router";
import userRouter from "./routes/user/router";
import boardRouter from "./routes/board/router";
import columnRouter from "./routes/column/router";
import taskRouter from "./routes/task/router";
import subtaskRouter from "./routes/subtask/router";

const { preflight, corsify } = createCors({
  methods: ["GET", "POST", "DELETE"],
  origins: ENVIRONMENT != "Production" ? ["*"] : ["https://kanban-35a.pages.dev"],
  maxAge: 3600
});

let mongo;

const router = Router();
router
  .all("*", preflight)
  .all("*", mongoWrapper.injectClient(mongo))
  .all("/v1/auth/*", authRouter.handle)
  .all("/v1/user/*", userRouter.handle)
  .all("/v1/board/*", boardRouter.handle)
  .all("/v1/column/*", columnRouter.handle)
  .all("/v1/task/*", taskRouter.handle)
  .all("/v1/subtask/*", subtaskRouter.handle)
  .get("/v1/healthcheck", () => json({ "worker-name": "be", environment: ENVIRONMENT }))
  .all("*", () => missing({ message: "Not Found." }));

export const handle = router.handle;
export { corsify };
