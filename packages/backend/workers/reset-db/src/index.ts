import { getInstance } from "@kanban/base-lib";

interface Environment {}

export default {
  async scheduled(event: ScheduledEvent, env: Environment, ctx: ExecutionContext) {
    ctx.waitUntil(handleScheduled());
  }
};

const handleScheduled = async () => {
  const mongo = await getInstance();
  await mongo.collection("user").deleteMany({});
  await mongo.collection("board").deleteMany({});
  await mongo.collection("column").deleteMany({});
  await mongo.collection("task").deleteMany({});
  await mongo.collection("subtask").deleteMany({});
};
