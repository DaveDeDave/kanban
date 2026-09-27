import type { getDatabase } from "@/config/db.config";

export type DatabaseClient = ReturnType<typeof getDatabase>["db"];
export type TransactionClient = Parameters<Parameters<DatabaseClient["transaction"]>[0]>[0];
export type Executor = DatabaseClient | TransactionClient;
export type Identity = { id: string; email: string };
