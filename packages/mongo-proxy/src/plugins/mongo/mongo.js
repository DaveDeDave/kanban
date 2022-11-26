import insertOne from "./endpoints/insertOne.js";
import insertMany from "./endpoints/insertMany.js";
import findOne from "./endpoints/findOne.js";
import find from "./endpoints/find.js";
import updateOne from "./endpoints/updateOne.js";
import updateMany from "./endpoints/updateMany.js";
import deleteOne from "./endpoints/deleteOne.js";
import deleteMany from "./endpoints/deleteMany.js";

const mongoPlugin = async (fastify, opts) => {
  fastify.post("/insertOne", insertOne);
  fastify.post("/insertMany", insertMany);
  fastify.post("/findOne", findOne);
  fastify.post("/find", find);
  fastify.post("/updateOne", updateOne);
  fastify.post("/updateMany", updateMany);
  fastify.post("/deleteOne", deleteOne);
  fastify.post("/deleteMany", deleteMany);
};

export default mongoPlugin;
