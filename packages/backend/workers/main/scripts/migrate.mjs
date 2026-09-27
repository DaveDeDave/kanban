import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to apply migrations");
}

const pool = new pg.Pool({ connectionString, connectionTimeoutMillis: 10_000 });
try {
  await migrate(drizzle(pool), {
    migrationsFolder: fileURLToPath(new URL("../drizzle", import.meta.url))
  });
  console.log("Drizzle migrations applied.");
} catch (error) {
  console.error("Drizzle migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
