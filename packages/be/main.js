import { Router } from "itty-router";
import { json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";
import { mongoWrapper } from "@kanban/lib";
import testRouter from "./routes/test/test";
import authRouter from "./routes/auth/auth";

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
  .all("/v1/test/*", testRouter.handle)
  .all("/v1/auth/*", authRouter.handle)
  .get("/v1/healthcheck", () => json({ "worker-name": "be", environment: ENVIRONMENT }))
  .all("*", () => missing({ message: "Not Found." }));

export const handle = router.handle;
export { corsify };
