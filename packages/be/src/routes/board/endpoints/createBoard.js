import { Board } from "@kanban/models";
import { json } from "itty-router-extras";

const controller = async ({ mongo, content, user }) => {
  const board = new Board({ name: content.name, ownerId: user._id });
  const result = await mongo.collection("board").insertOne(board);
  return json({ insertedId: result.insertedId });
};

const schema = {
  content: Board.schema
};

export default { schema, controller };
