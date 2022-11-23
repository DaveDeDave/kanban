import { Router } from "itty-router";
import { json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";
const router = Router();

const { preflight, corsify } = createCors({
  methods: ["GET", "POST", "DELETE"],
  origins: ENVIRONMENT != "Production" ? ["*"] : ["https://kanban-35a.pages.dev"],
  maxAge: 3600
});

router
  .all("*", preflight)
  .get("/healthcheck", () => json({ hello: "world" }))
  .get("/env", () => json({ environment: ENVIRONMENT }))
  .all("*", () => missing({ message: "Not Found." }));

export const handle = router.handle;
export { corsify };
