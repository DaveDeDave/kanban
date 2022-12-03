import { json } from "itty-router-extras";

const controller = async ({ mongo, user }) => {
  const boards = await mongo
    .collection("board")
    .find({ ownerId: user._id }, { projection: { ownerId: 0 } });
  return json(boards);
};

export default { controller };
