const handler = async function (req, res) {
  const {
    body: { db, collection, query }
  } = req;
  if (query._id) query._id = this.mongo.ObjectId(query._id);
  const cursor = await this.mongo.client.db(db).collection(collection).find(query);
  const items = await cursor.toArray();
  return items;
};

const schema = {
  summary: "Execute mongodb find operation",
  body: {
    type: "object",
    required: ["db", "collection", "query"],
    properties: {
      db: { type: "string" },
      collection: { type: "string" },
      query: { type: "object" }
    }
  }
};

export default { schema, handler };
