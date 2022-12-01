export default class Task {
  constructor({ ownerId, boardId, columnId, title, description, status }) {
    this.ownerId = ownerId;
    this.boardId = boardId;
    this.columnId = columnId;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

Task.statuses = ["TODO", "DOING", "COMPLETED"];
