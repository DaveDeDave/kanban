import { router } from "@/trpc/init";
import deleteUserRoute from "./routes/deleteUser.route";

export default router({
  deleteUser: deleteUserRoute
});
