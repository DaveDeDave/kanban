import Fastify from "fastify";
import mongoPlugin from "./src/plugins/mongo/mongo.js";
import fastifyMongodb from "@fastify/mongodb";
const app = Fastify();

app.register(fastifyMongodb, {
  forceClose: true,
  url: "mongodb://root:1234@kanban-mongo:27017"
});
app.register(mongoPlugin, { prefix: "/" });

export default app;
