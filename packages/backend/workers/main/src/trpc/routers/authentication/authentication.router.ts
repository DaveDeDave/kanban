import { router } from "@/config/trpc.config";
import login from "./routes/login.route";
import register from "./routes/register.route";

export default router({
  login,
  register
});
