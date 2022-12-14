const handler = async function (req, res) {
  const {
    body: { db, collection, document }
  } = req;
  if (document._id) document._id = this.mongo.ObjectId(document._id);
  const result = await this.mongo.client.db(db).collection(collection).insertOne(document);
  return result;
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
  }
};

export default { schema, handler };
