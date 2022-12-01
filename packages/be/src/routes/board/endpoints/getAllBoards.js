import { json } from "itty-router-extras";

export default async ({ mongo, user }) => {
  const boards = await mongo.collection("board").find({ ownerId: user._id });
  return json(boards);
};
