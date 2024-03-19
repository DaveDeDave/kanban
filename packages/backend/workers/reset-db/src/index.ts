import { Client } from "pg";

interface Environment {
  DATABASE_URL: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Environment, ctx: ExecutionContext) {
    console.log("env", env);
    ctx.waitUntil(handleScheduled(env));
  }
};

const handleScheduled = async (env: Environment) => {
  const client = new Client(env.DATABASE_URL);
  await client.connect();
  await client.query('DELETE FROM "User"');
};
