export default class Task {
  constructor({ ownerId, boardId, columnId, taskId, description, completed }) {
    this.ownerId = ownerId;
    this.boardId = boardId;
    this.columnId = columnId;
    this.taskId = taskId;
    this.description = description;
    this.completed = completed;
  }
}
