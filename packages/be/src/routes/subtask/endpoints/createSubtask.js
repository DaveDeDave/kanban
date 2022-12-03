import { HTTPError } from "@kanban/lib/src/error";
import { Subtask } from "@kanban/models";
import { json } from "itty-router-extras";

const controller = async ({ mongo, content, user }) => {
  const ids = await checkIds(mongo, user._id, { taskId: content.taskId });
  const subtask = new Subtask({
    description: content.description,
    completed: content.completed,
    ownerId: user._id,
    boardId: ids.boardId,
    columnId: ids.columnId,
    taskId: content.taskId
  });
  const result = await mongo.collection("subtask").insertOne(subtask);
  return json({ insertedId: result.insertedId });
};

const schema = {
  content: Subtask.createSchema
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
    return { boardId: task.boardId, columnId: task.columnId };
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
