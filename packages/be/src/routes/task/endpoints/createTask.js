import { HTTPError } from "@kanban/lib/src/error.js";
import { Task } from "@kanban/models";
import { json } from "itty-router-extras";

const controller = async ({ mongo, content, user }) => {
  const ids = await checkIds(mongo, user._id, { columnId: content.columnId });
  const task = new Task({
    title: content.title,
    description: content.description,
    status: content.status,
    ownerId: user._id,
    boardId: ids.boardId,
    columnId: content.columnId
  });
  const result = await mongo.collection("task").insertOne(task);
  return json({ insertedId: result.insertedId });
};

const schema = {
  content: Task.createSchema
};

const checkIds = async (mongo, userId, ids) => {
  try {
    const column = await mongo
      .collection("column")
      .findOne({ _id: mongo.ObjectID(ids.columnId), ownerId: userId });
    if (!column)
      throw new HTTPError({
        code: "error.doesnt_exist_column",
        status: 404,
        message: "column doesn't exist"
      });
    return { boardId: column.boardId };
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
