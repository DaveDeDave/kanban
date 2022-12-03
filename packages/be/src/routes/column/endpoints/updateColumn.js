import { HTTPError } from "@kanban/lib/src/error";
import { Column } from "@kanban/models";
import { status } from "itty-router-extras";

export default async ({ mongo, content, params, user }) => {
  await checkIds(mongo, user._id, { columnId: params.id });
  const update = getUpdate(content);
  await mongo.collection("column").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const schema = {
  content: Column.updateSchema
};

const getUpdate = (content) => {
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

export { schema, controller };
