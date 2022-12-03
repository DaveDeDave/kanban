export default class Subtask {
  constructor({ ownerId, boardId, columnId, taskId, description, completed }) {
    this.ownerId = ownerId;
    this.boardId = boardId;
    this.columnId = columnId;
    this.taskId = taskId;
    this.description = description;
    this.completed = completed;
  }
}

Subtask.createSchema = {
  type: "object",
  required: ["taskId", "description", "completed"],
  properties: {
    taskId: {
      type: "string"
    },
    description: {
      type: "string"
    },
    completed: {
      type: "boolean"
    }
  },
  additionalProperties: false
};

Subtask.updateSchema = Object.assign({}, Subtask.createSchema);
delete Task.updateSchema.required;
Subtask.updateSchema.anyOf = [{ required: ["description"] }, { required: ["completed"] }];
