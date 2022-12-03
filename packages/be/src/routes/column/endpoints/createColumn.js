import { HTTPError } from "@kanban/lib/src/error";
import { Column } from "@kanban/models";
import { json } from "itty-router-extras";

const controller = async ({ mongo, content, user }) => {
  await checkIds(mongo, user._id, { boardId: content.boardId });
  const column = new Column({
    name: content.name,
    color: content.color,
    ownerId: user._id,
    boardId: content.boardId
  });
  const result = await mongo.collection("column").insertOne(column);
  return json({ insertedId: result.insertedId });
};

const schema = {
  content: Column.schema
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

export default { schema, controller };
