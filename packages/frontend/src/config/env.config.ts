import { z } from "zod";

export const envSchema = z.object({
  VITE_MAIN_WORKER_ENDPOINT: z.string().url()
});

export default envSchema.parse(import.meta.env);
