import { router } from "@/config/trpc.config";
import createBoard from "./routes/create-board.route";
import deleteBoard from "./routes/delete-board.route";
import getBoards from "./routes/get-boards.route";
import updateBoard from "./routes/update-board.route";
import getBoardById from "./routes/get-board-by-id.route";

export default router({
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  updateBoard
});
