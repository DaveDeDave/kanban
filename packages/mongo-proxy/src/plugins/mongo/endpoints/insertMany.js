const handler = async function (req, res) {
  const {
    body: { db, collection, documents }
  } = req;
  const result = await this.mongo.client.db(db).collection(collection).insertMany(documents);
  return { success: result.acknowledged };
};

const schema = {
  summary: "Execute mongodb insertMany operation",
  body: {
    type: "object",
    required: ["db", "collection", "documents"],
    properties: {
      db: { type: "string" },
      collection: { type: "string" },
      documents: {
        type: "array",
        items: { type: "object" }
      }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success"],
      properties: {
        success: { type: "boolean" }
      }
    }
  }
};

export default { schema, handler };
