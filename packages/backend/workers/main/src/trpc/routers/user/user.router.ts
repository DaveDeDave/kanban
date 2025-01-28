import { router } from "@/config/trpc.config";
import getCurrentUserInfo from "./routes/getCurrentUserInfo";
import deleteUser from "./routes/deleteUser";

export default router({
  getCurrentUserInfo,
  deleteUser
});
