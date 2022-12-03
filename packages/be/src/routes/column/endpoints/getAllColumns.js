import { json } from "itty-router-extras";

const controller = async ({ mongo, query, user }) => {
  const columns = await mongo
    .collection("column")
    .find({ ownerId: user._id, boardId: query.boardId }, { projection: { ownerId: 0 } });
  return json(columns);
};

const schema = {
  query: {
    type: "object",
    required: ["boardId"],
    properties: {
      boardId: {
        type: "string"
      }
    },
    additionalProperties: false
  }
};

export default { schema, controller };
