import { status } from "itty-router-extras";

const controller = async ({ mongo, user }) => {
  await mongo.collection("subtask").deleteMany({ ownerId: user._id });
  await mongo.collection("task").deleteMany({ ownerId: user._id });
  await mongo.collection("column").deleteMany({ ownerId: user._id });
  await mongo.collection("board").deleteMany({ ownerId: user._id });
  await mongo.collection("user").deleteOne({ _id: mongo.ObjectID(user._id) });
  return status(204);
};

export { controller };
