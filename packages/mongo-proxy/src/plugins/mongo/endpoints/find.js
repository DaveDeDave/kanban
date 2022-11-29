const handler = async function (req, res) {
  const {
    body: { db, collection, query, options }
  } = req;
  if (query._id) query._id = this.mongo.ObjectId(query._id);
  const cursor = await this.mongo.client.db(db).collection(collection).find(query, options);
  const items = await cursor.toArray();
  return items;
};

const schema = {
  summary: "Execute mongodb find operation",
  body: {
    type: "object",
    required: ["db", "collection", "query", "options"],
    properties: {
      db: { type: "string" },
      collection: { type: "string" },
      query: { type: "object" },
      options: { type: "object" }
    }
  }
};

export default { schema, handler };
