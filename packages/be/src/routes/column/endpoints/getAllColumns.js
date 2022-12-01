import { HTTPError } from "@kanban/lib/src/error";
import { json } from "itty-router-extras";

export default async ({ mongo, query, user }) => {
  validate(query);
  const columns = await mongo
    .collection("column")
    .find({ ownerId: user._id, boardId: query.boardId });
  return json(columns);
};

const validate = (query) => {
  if (!query)
    throw new HTTPError({
      code: "error.missing_query",
      status: 400,
      message: "query is missing"
    });
  if (!query.boardId)
    throw new HTTPError({
      code: "error.missing_boardId",
      status: 400,
      message: "boardId query is missing"
    });
};
