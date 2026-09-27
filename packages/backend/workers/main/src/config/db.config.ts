import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/tables";

export const getDatabase = (connectionString: string) => {
  const pool = new Pool({ connectionString, max: 1 });
  return { db: drizzle(pool, { schema }), pool };
};
