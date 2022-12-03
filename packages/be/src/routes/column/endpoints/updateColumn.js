import { regex } from "@kanban/lib";
import { HTTPError } from "@kanban/lib/src/error";
import { status } from "itty-router-extras";

export default async ({ mongo, content, params, user }) => {
  const update = validate(content);
  await checkIds(mongo, user._id, { columnId: params.id });
  await mongo.collection("column").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const validate = (content) => {
  if (content === undefined)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (content.name === undefined && content.color === undefined)
    throw new HTTPError({
      code: "error.missing_update_fields",
      status: 400,
      message: "specify at least one update field amoung these: [name, color]"
    });
  if (content.name !== undefined && typeof content.name !== "string")
    throw new HTTPError({
      code: "error.wrong_format_name",
      status: 400,
      message: "name field must be a string"
    });
  if (content.color !== undefined && !regex.color.test(content.color))
    throw new HTTPError({
      code: "error.wrong_format_color",
      status: 400,
      message: "color field must be a color (e.g. #ffffff)"
    });
  const update = { $set: {} };
  if (content.name) update.$set.name = content.name;
  if (content.color) update.$set.color = content.color;
  return update;
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
