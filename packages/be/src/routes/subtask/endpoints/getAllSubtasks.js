import { json } from "itty-router-extras";

const controller = async ({ mongo, query, user }) => {
  const subtasks = await mongo
    .collection("subtask")
    .find({ ownerId: user._id, taskId: query.taskId }, { projection: { ownerId: 0 } });
  return json(subtasks);
};

const schema = {
  query: {
    type: "object",
    required: ["taskId"],
    properties: {
      taskId: {
        type: "string"
      }
    },
    additionalProperties: false
  }
};

export default { schema, controller };
