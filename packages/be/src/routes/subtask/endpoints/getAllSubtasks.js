import { HTTPError } from "@kanban/lib/src/error";
import { json } from "itty-router-extras";

export default async ({ mongo, query, user }) => {
  validate(query);
  const subtasks = await mongo
    .collection("subtask")
    .find({ ownerId: user._id, taskId: query.taskId });
  return json(subtasks);
};

const validate = (query) => {
  if (query === undefined)
    throw new HTTPError({
      code: "error.missing_query",
      status: 400,
      message: "query is missing"
    });
  if (query.taskId === undefined)
    throw new HTTPError({
      code: "error.missing_taskId",
      status: 400,
      message: "taskId query is missing"
    });
};
