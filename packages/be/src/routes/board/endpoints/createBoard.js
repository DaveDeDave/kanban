import { HTTPError } from "@kanban/lib/src/error";
import { Board } from "@kanban/models";
import { json } from "itty-router-extras";

export default async ({ mongo, content, user }) => {
  validate(content);
  const board = new Board({ name: content.name, ownerId: user._id });
  const result = await mongo.collection("board").insertOne(board);
  return json({ insertedId: result.insertedId });
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
      code: "error.missing_name",
      status: 400,
      message: "name field missing"
    });
  if (typeof content.name !== "string")
    throw new HTTPError({
      code: "error.wrong_format_name",
      status: 400,
      message: "name field must be a string"
    });
};
