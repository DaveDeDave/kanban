import { router } from "@/trpc/init";
import login from "./routes/login";
import register from "./routes/register";

export default router({
  login,
  register
});
