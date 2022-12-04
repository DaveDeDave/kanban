const handler = async function (req, res) {
  const {
    body: { db, collection, documents }
  } = req;
  const mongo = this.mongo;
  await Promise.all(
    documents.map(async (document) => {
      if (document._id) document._id = mongo.ObjectId(document._id);
    })
  );
  const result = await this.mongo.client.db(db).collection(collection).insertMany(documents);
  return result;
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
  }
};

export default { schema, handler };
