import { handle } from "./main.js";

addEventListener("fetch", (event) => event.respondWith(handle(event.request)));
