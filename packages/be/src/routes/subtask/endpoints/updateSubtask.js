import { HTTPError } from "@kanban/lib/src/error";
import { Subtask } from "@kanban/models";
import { status } from "itty-router-extras";

const controller = async ({ mongo, content, params, user }) => {
  await checkIds(mongo, user._id, { subtaskId: params.id });
  const update = getUpdate(content);
  await mongo.collection("subtask").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const schema = {
  content: Subtask.updateSchema
};

const getUpdate = (content) => {
  const update = { $set: {} };
  if (content.description) update.$set.description = content.description;
  if (content.completed) update.$set.completed = content.completed;
  return update;
};

const checkIds = async (mongo, userId, ids) => {
  try {
    const subtask = await mongo
      .collection("subtask")
      .findOne({ _id: mongo.ObjectID(ids.subtaskId), ownerId: userId });
    if (!subtask)
      throw new HTTPError({
        code: "error.doesnt_exist_subtask",
        status: 404,
        message: "subtask doesn't exist"
      });
  } catch (e) {
    if (e.name == "BSONTypeError") {
      throw new HTTPError({
        code: "error.invalid_id",
        status: 400,
        message: "invalid id"
      });
    } else throw e;
  }
};

export default { schema, controller };
