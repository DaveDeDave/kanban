import { json } from "itty-router-extras";

export default async ({ mongo }) => {
  const collection = mongo.collection("test");
  const users = await collection.find({});
  return json({ users });
};
