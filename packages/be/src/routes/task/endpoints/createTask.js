import { HTTPError } from "@kanban/lib/src/error";
import { Task } from "@kanban/models";
import { json } from "itty-router-extras";

export default async ({ mongo, content, user }) => {
  validate(content);
  await checkIds(mongo, user._id, { boardId: content.boardId, columnId: content.columnId });
  const task = new Task({
    title: content.title,
    description: content.description,
    status: content.status,
    ownerId: user._id,
    boardId: content.boardId,
    columnId: content.columnId
  });
  const result = await mongo.collection("task").insertOne(task);
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
  if (!content.title)
    throw new HTTPError({
      code: "error.missing_title",
      status: 400,
      message: "title field missing"
    });
  if (!content.description)
    throw new HTTPError({
      code: "error.missing_description",
      status: 400,
      message: "description field missing"
    });
  if (!content.status)
    throw new HTTPError({
      code: "error.missing_status",
      status: 400,
      message: "status field missing"
    });
  if (Task.statuses.indexOf(content.status) == -1)
    throw new HTTPError({
      code: "error.wrong_format_status",
      status: 400,
      message: `status must be one amoung these: [${Task.statuses.join(", ")}]`
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
