import { router } from "@/config/trpc.config";
import getCurrentUserInfo from "./routes/get-current-user-info.route";
import deleteUser from "./routes/delete-user.route";

export default router({
  getCurrentUserInfo,
  deleteUser
});
