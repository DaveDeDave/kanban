import { Router } from "itty-router";
import { json, missing, withContent } from "itty-router-extras";
import { createCors } from "itty-cors";
import { mongoWrapper } from "@kanban/lib";
const router = Router();

const { preflight, corsify } = createCors({
  methods: ["GET", "POST", "DELETE"],
  origins: ENVIRONMENT != "Production" ? ["*"] : ["https://kanban-35a.pages.dev"],
  maxAge: 3600
});

router
  .all("*", preflight)
  .post("/test", withContent, async ({ content }) => {
    const mongo = await mongoWrapper.getInstance();
    const collection = mongo.collection("test");
    await collection.insertOne({ test: content.name });
    return json({ message: "success" });
  })
  .get("/test", async () => {
    const mongo = await mongoWrapper.getInstance();
    const collection = mongo.collection("test");
    const users = await collection.find({});
    return json({ users });
  })
  .get("/healthcheck", () => json({ hello: "world" }))
  .get("/env", () => json({ environment: ENVIRONMENT }))
  .all("*", () => missing({ message: "Not Found." }));

export const handle = router.handle;
export { corsify };
