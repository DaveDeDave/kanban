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

router.all("*", () => new Response("Not Found.", { status: 404 }));

addEventListener("fetch", (event) =>
  event.respondWith(router.handle(event.request))
);
