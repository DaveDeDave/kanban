import { z } from "zod";

export const envSchema = z.object({
  VITE_MAIN_WORKER_ENDPOINT: z.string().url(),
  VITE_REACT_QUERY_DEVTOOLS: z
    .string()
    .transform((value) => value === "true")
    .optional(),
  VITE_REACT_ROUTER_DEVTOOLS: z
    .string()
    .transform((value) => value === "true")
    .optional()
});

export default envSchema.parse(import.meta.env);
