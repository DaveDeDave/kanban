import { HTTPError } from "@kanban/lib/src/error";
import { Task } from "@kanban/models";
import { status } from "itty-router-extras";

export default async ({ mongo, content, params, user }) => {
  await checkIds(mongo, user._id, { taskId: params.id });
  const update = getUpdate(content);
  await mongo.collection("task").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const schema = {
  content: Task.updateSchema
};

const getUpdate = (content) => {
  const update = { $set: {} };
  if (content.title !== undefined) update.$set.title = content.title;
  if (content.description !== undefined) update.$set.description = content.description;
  if (content.status !== undefined) update.$set.status = content.status;
  return update;
};

const checkIds = async (mongo, userId, ids) => {
  try {
    const task = await mongo
      .collection("task")
      .findOne({ _id: mongo.ObjectID(ids.taskId), ownerId: userId });
    if (!task)
      throw new HTTPError({
        code: "error.doesnt_exist_task",
        status: 404,
        message: "task doesn't exist"
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

export { schema, controller };
