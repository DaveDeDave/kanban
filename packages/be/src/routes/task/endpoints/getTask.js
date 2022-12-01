import { json } from "itty-router-extras";

export default async ({ mongo, params, user }) => {
  try {
    const task = await task
      .collection("task")
      .findOne({ _id: mongo.ObjectID(params.id), ownerId: user._id });
    if (!task)
      throw new HTTPError({
        code: "error.doesnt_exist_task",
        status: 404,
        message: "task doesn't exist"
      });
    return json(task);
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
