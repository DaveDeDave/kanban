import { HTTPError } from "@kanban/lib/src/error";
import { status } from "itty-router-extras";

export default async ({ mongo, params, user }) => {
  await checkIds(mongo, user._id, { columnId: params.id });
  await mongo.collection("subtask").deleteMany({ columnId: params.id });
  await mongo.collection("task").deleteMany({ columnId: params.id });
  await mongo.collection("column").deleteOne({ _id: mongo.ObjectID(params.id) });
  return status(204);
};

const checkIds = async (mongo, userId, ids) => {
  try {
    const column = await mongo
      .collection("column")
      .findOne({ _id: mongo.ObjectID(ids.columnId), ownerId: userId });
    if (!column)
      throw new HTTPError({
        code: "error.doesnt_exist_board",
        status: 404,
        message: "column doesn't exist"
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
