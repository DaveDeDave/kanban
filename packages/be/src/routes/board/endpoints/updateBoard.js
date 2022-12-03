import { HTTPError } from "@kanban/lib/src/error";
import { Board } from "@kanban/models";
import { status } from "itty-router-extras";

const controller = async ({ mongo, content, params, user }) => {
  await checkIds(mongo, user._id, { boardId: params.id });
  const update = { $set: { name: content.name } };
  await mongo.collection("board").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const schema = {
  content: Board.schema
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

export { schema, controller };
