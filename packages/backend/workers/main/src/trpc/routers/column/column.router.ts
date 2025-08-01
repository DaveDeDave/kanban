import { router } from "@/config/trpc.config";
import createColumn from "./routes/create-column.route";
import deleteColumn from "./routes/delete-column.route";
import getColumnsByBoard from "./routes/get-columns-by-board.route";
import updateColumn from "./routes/update-column.route";
import sortColumns from "./routes/sort-columns.route";

export default router({
  createColumn,
  deleteColumn,
  getColumnsByBoard,
  updateColumn,
  sortColumns
});
