import { HTTPError } from "@kanban/lib/src/error.js";
import { status } from "itty-router-extras";

const controller = async ({ mongo, params, user }) => {
  await checkIds(mongo, user._id, { taskId: params.id });
  await mongo.collection("subtask").deleteMany({ taskId: params.id });
  await mongo.collection("task").deleteOne({ _id: mongo.ObjectID(params.id) });
  return status(204);
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

export default { controller };
