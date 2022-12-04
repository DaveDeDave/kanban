db = connect("mongodb://localhost:27017/kanban");

db.createCollection("user", {
  validator: {
    $jsonSchema: {
      required: ["_id", "email", "password"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string" },
        password: { bsonType: "string" }
      },
      additionalProperties: false
    }
  }
});

db.createCollection("board", {
  validator: {
    $jsonSchema: {
      required: ["_id", "ownerId", "name"],
      properties: {
        _id: { bsonType: "objectId" },
        ownerId: { bsonType: "string" },
        name: { bsonType: "string" }
      },
      additionalProperties: false
    }
  }
});

db.createCollection("column", {
  validator: {
    $jsonSchema: {
      required: ["_id", "ownerId", "boardId", "name", "color"],
      properties: {
        _id: { bsonType: "objectId" },
        ownerId: { bsonType: "string" },
        boardId: { bsonType: "string" },
        name: { bsonType: "string" },
        color: { bsonType: "string" }
      },
      additionalProperties: false
    }
  }
});

db.createCollection("task", {
  validator: {
    $jsonSchema: {
      required: ["_id", "ownerId", "boardId", "columnId", "title", "description", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        ownerId: { bsonType: "string" },
        boardId: { bsonType: "string" },
        columnId: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        status: { bsonType: "string" }
      },
      additionalProperties: false
    }
  }
});

db.createCollection("subtask", {
  validator: {
    $jsonSchema: {
      required: ["_id", "ownerId", "boardId", "columnId", "taskId", "description", "completed"],
      properties: {
        _id: { bsonType: "objectId" },
        ownerId: { bsonType: "string" },
        boardId: { bsonType: "string" },
        columnId: { bsonType: "string" },
        taskId: { bsonType: "string" },
        description: { bsonType: "string" },
        completed: { bsonType: "bool" }
      },
      additionalProperties: false
    }
  }
});

db.user.createIndex({ email: 1 }, { unique: true });
