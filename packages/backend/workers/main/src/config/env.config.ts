import { z } from "zod";

export const envSchema = z.object({
  ENVIRONMENT: z.union([z.literal("Development"), z.literal("Production"), z.literal("Testing")]),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string()
});

export type Env = z.infer<typeof envSchema>;
