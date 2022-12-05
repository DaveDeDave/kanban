import { getInstance } from "@kanban/lib/src/mongoWrapper.js";

addEventListener("scheduled", (event) => {
  event.waitUntil(handleScheduled());
});

const handleScheduled = async () => {
  const mongo = await getInstance();
  await mongo.collection("user").deleteMany({});
  await mongo.collection("board").deleteMany({});
  await mongo.collection("column").deleteMany({});
  await mongo.collection("task").deleteMany({});
  await mongo.collection("subtask").deleteMany({});
};
