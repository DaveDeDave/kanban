import { HTTPError } from "@kanban/lib/src/error";
import { status } from "itty-router-extras";

const controller = async ({ mongo, params, user }) => {
  await checkIds(mongo, user._id, { boardId: params.id });
  await mongo.collection("subtask").deleteMany({ boardId: params.id });
  await mongo.collection("task").deleteMany({ boardId: params.id });
  await mongo.collection("column").deleteMany({ boardId: params.id });
  await mongo.collection("board").deleteOne({ _id: mongo.ObjectID(params.id) });
  return status(204);
};

const checkIds = async (mongo, userId, ids) => {
  try {
    const board = await mongo
      .collection("board")
      .findOne({ _id: mongo.ObjectID(ids.boardId), ownerId: userId });
    if (!board)
      throw new HTTPError({
        code: "error.doesnt_exist_board",
        status: 404,
        message: "board doesn't exist"
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
