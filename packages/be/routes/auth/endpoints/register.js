import { bcryptWrapper, jwt, regex } from "@kanban/lib";
import { json, error } from "itty-router-extras";
import { User } from "@kanban/models";

export default async ({ mongo, content }) => {
  const isError = validate(content);
  if (isError) return isError;
  const password = await bcryptWrapper.hash(content.password, 10);
  const user = new User({ email: content.email, password });
  try {
    await mongo.collection("user").insertOne(user);
  } catch (e) {
    if (e.code == "MONGOERROR-11000") return error(400, "Email already exists");
    else return error(500, "Uknown error");
  }
  delete user.password;
  const token = await jwt.sign(user, {});
  return json({ token });
};

const validate = (content) => {
  if (!content.email) return error(400, "email field missing");
  if (!content.password) return error(400, "password field missing");
  if (!regex.email.test(content.email)) return error(400, "email field must be email format");
  if (!regex.password.test(content.password))
    return error(
      400,
      "password field must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number and a symbol among these: !\"#$%'()*+,-./"
    );
};
