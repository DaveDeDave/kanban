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

db.user.createIndex({ email: 1 }, { unique: true });
