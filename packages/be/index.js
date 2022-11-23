import { handle, corsify } from "./main.js";

addEventListener("fetch", (event) => event.respondWith(handle(event.request).then(corsify)));
