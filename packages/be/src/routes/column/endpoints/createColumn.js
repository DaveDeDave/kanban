import { regex } from "@kanban/lib";
import { HTTPError } from "@kanban/lib/src/error";
import { Column } from "@kanban/models";
import { json } from "itty-router-extras";

export default async ({ mongo, content, user }) => {
  validate(content);
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
  if (!content.name)
    throw new HTTPError({
      code: "error.missing_name",
      status: 400,
      message: "name field missing"
    });
  if (content.color && !regex.color.test(content.color))
    throw new HTTPError({
      code: "error.wrong_format_color",
      status: 400,
      message: "color field must be a color (e.g. #ffffff)"
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
