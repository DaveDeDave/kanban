export default class Column {
  constructor({ ownerId, boardId, name, color }) {
    this.ownerId = ownerId;
    this.boardId = boardId;
    this.name = name;
    if (color) this.color = color;
  }
}
