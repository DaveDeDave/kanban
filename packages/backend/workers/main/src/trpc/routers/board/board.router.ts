import { router } from "@/config/trpc.config";
import createBoard from "./routes/createBoard";
import deleteBoard from "./routes/deleteBoard";
import getBoards from "./routes/getBoards";
import updateBoard from "./routes/updateBoard";
import getBoardById from "./routes/getBoardById";

export default router({
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  updateBoard
});
