import { HTTPError } from "@kanban/lib/src/error";
import { Subtask } from "@kanban/models";
import { json } from "itty-router-extras";

export default async ({ mongo, content, user }) => {
  validate(content);
  await checkIds(mongo, user._id, {
    boardId: content.boardId,
    columnId: content.columnId,
    taskId: content.taskId
  });
  const subtask = new Subtask({
    description: content.description,
    ownerId: user._id,
    boardId: content.boardId,
    columnId: content.columnId,
    taskId: content.taskId
  });
  const result = await mongo.collection("subtask").insertOne(subtask);
  return json({ insertedId: result.insertedId });
};

const validate = (content) => {
  if (!content)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (!content.boardId)
    throw new HTTPError({
      code: "error.missing_boardId",
      status: 400,
      message: "boardId field missing"
    });
  if (!content.columnId)
    throw new HTTPError({
      code: "error.missing_columnId",
      status: 400,
      message: "columnId field missing"
    });
  if (!content.taskId)
    throw new HTTPError({
      code: "error.missing_taskId",
      status: 400,
      message: "taskId field missing"
    });
  if (!content.description)
    throw new HTTPError({
      code: "error.missing_description",
      status: 400,
      message: "description field missing"
    });
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
    const column = await mongo
      .collection("column")
      .findOne({ _id: mongo.ObjectID(ids.columnId), ownerId: userId });
    if (!column)
      throw new HTTPError({
        code: "error.doesnt_exist_column",
        status: 404,
        message: "column doesn't exist"
      });
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
