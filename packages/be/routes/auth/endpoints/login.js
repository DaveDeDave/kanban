import { jwt, regex } from "@kanban/lib";
import { compare } from "@kanban/lib/src/bcryptWrapper";
import { error, json } from "itty-router-extras";

export default async ({ mongo, content }) => {
  const isError = validate(content);
  if (isError) return isError;
  const user = await mongo.collection("user").findOne({ email: content.email });
  if (!user) return error(400, "email doesn't exist");
  const valid = await compare(content.password, user.password);
  if (!valid) return error(400, "wrong password");
  delete user._id;
  delete user.password;
  const token = await jwt.sign(user, {});
  return json({ token });
};

const validate = (content) => {
  if (!content.email) return error(400, "email field missing");
  if (!content.password) return error(400, "password field missing");
  if (!regex.email.test(content.email)) return error(400, "email field must be email format");
};
