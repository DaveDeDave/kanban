const handler = async function (req, res) {
  const {
    body: { db, collection, document }
  } = req;
  const result = await this.mongo.client.db(db).collection(collection).insertOne(document);
  return { success: result.acknowledged };
};

const schema = {
  summary: "Execute mongodb insertOne operation",
  body: {
    type: "object",
    required: ["db", "collection", "document"],
    properties: {
      db: { type: "string" },
      collection: { type: "string" },
      document: { type: "object" }
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
