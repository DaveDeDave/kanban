import { router } from "@/config/trpc.config";
import createColumn from "./routes/create-column.route";
import deleteColumn from "./routes/delete-column.route";
import getColumnsByBoard from "./routes/get-columns-by-board.route";
import updateColumn from "./routes/update-column.route";
import rankColumn from "./routes/rank-column.route";

export default router({
  createColumn,
  deleteColumn,
  getColumnsByBoard,
  updateColumn,
  rankColumn
});
