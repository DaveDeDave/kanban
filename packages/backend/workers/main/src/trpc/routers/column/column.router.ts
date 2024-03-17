import { router } from "@/trpc/init";
import createColumn from "./routes/createColumn";
import deleteColumn from "./routes/deleteColumn";
import getColumnsByBoard from "./routes/getColumnsByBoard";
import updateColumn from "./routes/updateColumn";

export default router({
  createColumn,
  deleteColumn,
  getColumnsByBoard,
  updateColumn
});
