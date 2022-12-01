import { status } from "itty-router-extras";

export default async ({ mongo, params, user }) => {
  await checkIds(mongo, user._id, { subtaskId: params.id });
  await mongo.collection("subtask").deleteOne({ _id: mongo.ObjectID(params.id) });
  return status(204);
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
