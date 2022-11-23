import { Router } from "itty-router";
const router = Router();

router.get(
  "/healthcheck",
  () =>
    new Response(JSON.stringify({ hello: "world" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })
);

router.get(
  "/env",
  () =>
    new Response(JSON.stringify({ environment: ENVIRONMENT }), {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })
);

router.all("*", () => new Response("Not Found.", { status: 404 }));

export const handle = router.handle;
