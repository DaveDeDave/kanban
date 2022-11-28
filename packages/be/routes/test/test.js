import { Router } from "itty-router";
import { withContent } from "itty-router-extras";
import getAll from "./endpoints/getAll";
import insertOne from "./endpoints/insertOne";

const testRouter = Router({ base: "/v1/test" });
testRouter.post("/", withContent, insertOne);
testRouter.get("/", getAll);

export default testRouter;
