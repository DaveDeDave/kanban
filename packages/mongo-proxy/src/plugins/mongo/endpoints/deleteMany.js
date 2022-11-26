const handler = async function (req, res) {
  const {
    body: { db, collection, filter }
  } = req;
  if (filter._id) filter._id = this.mongo.ObjectId(filter._id);
  const result = await this.mongo.client.db(db).collection(collection).deleteMany(filter);
  return { success: result.acknowledged };
};

const schema = {
  summary: "Execute mongodb deleteMany operation",
  body: {
    type: "object",
    required: ["db", "collection", "filter"],
    properties: {
      db: { type: "string" },
      collection: { type: "string" },
      filter: { type: "object" }
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
