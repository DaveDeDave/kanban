import { HttpNotFoundException } from "@kanban/base-lib";
import { BoardRepository } from "@/repositories/board.repository";
import { ColumnRepository } from "@/repositories/column.repository";
import { TaskRepository } from "@/repositories/task.repository";

export class BoardService {
  constructor(private readonly boards: BoardRepository, private readonly columns: ColumnRepository, private readonly tasks: TaskRepository) {}

  async createBoard(input: { name: string; description: string }, ownerId: string) {
    return { createdBoard: await this.boards.create({ ...input, ownerId }) };
  }

  async updateBoard(input: { boardId: string; name: string; description: string }, ownerId: string) {
    if (!(await this.boards.findOneByIdAndOwner(input.boardId, ownerId))) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    const updatedBoard = await this.boards.updateByIdAndOwner(input.boardId, ownerId, { name: input.name, description: input.description });
    if (!updatedBoard) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    return { updatedBoard };
  }

  async deleteBoard(boardId: string, ownerId: string) {
    if (!(await this.boards.findOneByIdAndOwner(boardId, ownerId))) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    const deletedBoard = await this.boards.deleteByIdAndOwner(boardId, ownerId);
    if (!deletedBoard) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    return { deletedBoard };
  }

  async getBoards(input: { limit: number; cursor?: string | null }, ownerId: string) {
    const boards = await this.boards.findManyByOwner(ownerId, input.limit + 1, input.cursor);
    const nextCursor = boards.length > input.limit ? boards.pop()?.id : undefined;
    return { boards, nextCursor };
  }

  async getBoardById(boardId: string, ownerId: string) {
    const board = await this.boards.findOneByIdAndOwner(boardId, ownerId);
    if (!board) throw new HttpNotFoundException({ errorCode: "BoardNotFound" });
    const columns = await this.columns.findManyByBoard(boardId);
    return { board: { ...board, columns: await Promise.all(columns.map(async (column) => ({ ...column, tasks: await this.tasks.findManyByColumn(column.id) }))) } };
  }
}
