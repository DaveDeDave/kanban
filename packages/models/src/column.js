import { regex } from "@kanban/lib";

export default class Column {
  constructor({ ownerId, boardId, name, color }) {
    this.ownerId = ownerId;
    this.boardId = boardId;
    this.name = name;
    this.color = color || "#457b9d";
  }
}

Column.schema = {
  type: "object",
  required: ["boardId", "name"],
  properties: {
    boardId: {
      type: "string"
    },
    name: {
      type: "string"
    },
    color: {
      type: "string",
      pattern: regex.color,
      errorPattern: "color field must be a color (e.g. #ffffff)"
    }
  },
  additionalProperties: false
};

Column.updateSchema = Object.assign({}, Column.schema);
delete Column.updateSchema.required;
Column.updateSchema.anyOf = [{ required: ["boardId"] }, { required: ["name"] }];
