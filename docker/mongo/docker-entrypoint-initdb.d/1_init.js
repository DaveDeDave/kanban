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
        ownerId: { bsonType: "objectId" },
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
        ownerId: { bsonType: "objectId" },
        boardId: { bsonType: "objectId" },
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
        ownerId: { bsonType: "objectId" },
        boardId: { bsonType: "objectId" },
        columnId: { bsonType: "objectId" },
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
      required: ["_id", "ownerId", "boardId", "columnId", "taskId", "description"],
      properties: {
        _id: { bsonType: "objectId" },
        ownerId: { bsonType: "objectId" },
        boardId: { bsonType: "objectId" },
        columnId: { bsonType: "objectId" },
        taskId: { bsonType: "objectId" },
        description: { bsonType: "string" }
      },
      additionalProperties: false
    }
  }
});

db.user.createIndex({ email: 1 }, { unique: true });
