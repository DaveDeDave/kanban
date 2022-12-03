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

Task.createSchema = {
  type: "object",
  required: ["columnId", "title", "description", "status"],
  properties: {
    columnId: {
      type: "string"
    },
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    status: {
      type: "string",
      pattern: /^(TODO|DOING|COMPLETED)$/,
      errorPattern: "status must be one amoung these: [TODO, DOING, COMPLETED]"
    }
  },
  additionalProperties: false
};

Task.updateSchema = JSON.parse(JSON.stringify(Task.createSchema));
delete Task.updateSchema.required;
Task.updateSchema.properties.status.pattern = /^(TODO|DOING|COMPLETED)$/;
Task.updateSchema.anyOf = [
  { required: ["title"] },
  { required: ["description"] },
  { required: ["status"] }
];
