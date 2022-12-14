const handler = async function (req, res) {
  const {
    body: { db, collection, filter, update }
  } = req;
  if (filter._id) filter._id = this.mongo.ObjectId(filter._id);
  const result = await this.mongo.client.db(db).collection(collection).updateOne(filter, update);
  return result;
};

const schema = {
  summary: "Execute mongodb updateOne operation",
  body: {
    type: "object",
    required: ["db", "collection", "filter", "update"],
    properties: {
      db: { type: "string" },
      collection: { type: "string" },
      filter: { type: "object" },
      update: { type: "object" }
    }
  }
};

export default { schema, handler };
