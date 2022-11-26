const handler = async function (req, res) {
  const {
    body: { db, collection, query }
  } = req;
  if (query._id) query._id = this.mongo.ObjectId(query._id);
  const result = await this.mongo.client.db(db).collection(collection).findOne(query);
  return result;
};

const schema = {
  summary: "Execute mongodb findOne operation",
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
