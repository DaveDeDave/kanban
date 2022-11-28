import { json } from "itty-router-extras";

export default async ({ content, mongo }) => {
  const collection = mongo.collection("test");
  await collection.insertOne({ test: content.name });
  return json({ message: "success" });
};
