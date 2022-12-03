import { HTTPError } from "@kanban/lib/src/error";
import { Task } from "@kanban/models";
import { status } from "itty-router-extras";

export default async ({ mongo, content, params, user }) => {
  const update = validate(content);
  await checkIds(mongo, user._id, { taskId: params.id });
  await mongo.collection("task").updateOne({ _id: mongo.ObjectID(params.id) }, update);
  return status(204);
};

const validate = (content) => {
  if (content === undefined)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (
    content.title === undefined &&
    content.description === undefined &&
    content.status === undefined
  )
    throw new HTTPError({
      code: "error.missing_update_fields",
      status: 400,
      message: "specify at least one update field amoung these: [title, description, status]"
    });
  if (content.title !== undefined && typeof content.title !== "string")
    throw new HTTPError({
      code: "error.wrong_format_title",
      status: 400,
      message: "title must be a string"
    });
  if (content.description !== undefined && typeof content.description !== "string")
    throw new HTTPError({
      code: "error.wrong_format_description",
      status: 400,
      message: "description must be a string"
    });
  if (content.status !== undefined && Task.statuses.indexOf(content.status) == -1)
    throw new HTTPError({
      code: "error.wrong_format_status",
      status: 400,
      message: `status must be one amoung these: [${Task.statuses.join(", ")}]`
    });
  const update = { $set: {} };
  if (content.title !== undefined) update.$set.title = content.title;
  if (content.description !== undefined) update.$set.description = content.description;
  if (content.status !== undefined) update.$set.status = content.status;
  return update;
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
