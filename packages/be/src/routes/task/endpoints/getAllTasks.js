import { json } from "itty-router-extras";

const controller = async ({ mongo, query, user }) => {
  validate(query);
  const tasks = await mongo
    .collection("task")
    .find({ ownerId: user._id, columnId: query.columnId }, { projection: { ownerId: 0 } });
  return json(tasks);
};

const schema = {
  query: {
    type: "object",
    required: ["columnId"],
    properties: {
      columnId: {
        type: "string"
      }
    },
    additionalProperties: false
  }
};

export { schema, controller };
