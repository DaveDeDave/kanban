import Fastify from "fastify";
import fastifyMongodb from "@fastify/mongodb";
import { MongoClient } from "mongodb";
import mongoPlugin from "./src/plugins/mongo/mongo.js";
const app = Fastify();

const client = await MongoClient.connect("mongodb://root:1234@kanban-mongo:27017");

app.setErrorHandler(function (error, request, reply) {
  const body = JSON.parse(JSON.stringify(error));
  body.name = error.name;
  body.message = error.message;
  if (error.name == "MongoServerError") reply.status(400).send(body);
  else reply.status(500).send(body);
});

app.register(fastifyMongodb, {
  forceClose: true,
  client,
  url: "mongodb://root:1234@kanban-mongo:27017"
});
app.register(mongoPlugin, { prefix: "/" });

export default app;
