import { HTTPError } from "@kanban/lib/src/error";
import { status } from "itty-router-extras";

export default async ({ mongo, content, params, user }) => {
  const update = validate(content);
  await checkIds(mongo, user._id, { boardId: params.id });
  await mongo.collection("board").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const validate = (content) => {
  if (content === undefined)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (content.name === undefined)
    throw new HTTPError({
      code: "error.missing_update_fields",
      status: 400,
      message: "specify at least one update field amoung these: [name]"
    });
  if (typeof content.name !== "string")
    throw new HTTPError({
      code: "error.wrong_format_name",
      status: 400,
      message: "name field must be a string"
    });
  return { $set: { name: content.name } };
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
