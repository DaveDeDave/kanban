import { HTTPError } from "@kanban/lib/src/error";
import { json } from "itty-router-extras";

export default async ({ mongo, query, user }) => {
  validate(query);
  const tasks = await mongo
    .collection("task")
    .find({ ownerId: user._id, columnId: query.columnId });
  return json(tasks);
};

const validate = (query) => {
  if (!query)
    throw new HTTPError({
      code: "error.missing_query",
      status: 400,
      message: "query is missing"
    });
  if (!query.columnId)
    throw new HTTPError({
      code: "error.missing_columnId",
      status: 400,
      message: "columnId query is missing"
    });
};
