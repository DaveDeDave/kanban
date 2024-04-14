import { router } from "@/config/trpc.config";
import login from "./routes/login";
import register from "./routes/register";

export default router({
  login,
  register
});
