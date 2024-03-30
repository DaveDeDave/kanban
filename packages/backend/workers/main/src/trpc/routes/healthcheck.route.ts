import { z } from "zod";
import { publicProcedure } from "../init";

export default publicProcedure
  .output(
    z.object({
      status: z.literal("online")
    })
  )
  .query(async () => {
    return {
      "worker-name": "main",
      status: "online"
    };
  });
