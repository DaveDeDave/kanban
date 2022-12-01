import { HTTPError } from "@kanban/lib/src/error";
import { status } from "itty-router-extras";

export default async ({ mongo, content, params, user }) => {
  const update = validate(content);
  await checkIds(mongo, user._id, { subtaskId: params.id });
  await mongo.collection("subtask").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const validate = () => {
  if (!content)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (!content.description)
    throw new HTTPError({
      code: "error.missing_update_fields",
      status: 400,
      message: "specify at least one update field amoung these: [description]"
    });
  return { $set: { description: content.description } };
};

const checkIds = async (mongo, userId, ids) => {
  try {
    const subtask = await mongo
      .collection("subtask")
      .findOne({ _id: mongo.ObjectID(ids.subtaskId), ownerId: userId });
    if (!subtask)
      throw new HTTPError({
        code: "error.doesnt_exist_subtask",
        status: 404,
        message: "subtask doesn't exist"
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
