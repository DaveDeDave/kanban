export default class Column {
  constructor({ ownerId, boardId, name, color }) {
    this.ownerId = ownerId;
    this.boardId = boardId;
    this.name = name;
    this.color = color || "#457b9d";
  }
}
