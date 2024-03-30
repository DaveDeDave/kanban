import { z } from "zod";
import { publicProcedure } from "../init";

export default publicProcedure
  .output(
    z.object({
      "worker-name": z.literal("main"),
      status: z.literal("online")
    })
  )
  .query(async () => {
    return {
      "worker-name": "main",
      status: "online"
    };
  });
