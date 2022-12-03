import { jwt } from "@kanban/lib";
import { compare } from "@kanban/lib/src/bcryptWrapper";
import { HTTPError } from "@kanban/lib/src/error";
import { User } from "@kanban/models";
import { json } from "itty-router-extras";

const controller = async ({ mongo, content }) => {
  const user = await mongo.collection("user").findOne({ email: content.email });
  if (!user)
    throw new HTTPError({
      code: "error.doesnt_exist_email",
      status: 400,
      message: "email doesn't exist"
    });
  const valid = await compare(content.password, user.password);
  if (!valid)
    throw HTTPError({ code: "error.wrong_password", status: 400, message: "wrong password" });
  delete user.password;
  const token = await jwt.sign(user);
  return json({ token });
};

const loginSchema = User.schema;
delete loginSchema.properties.password.pattern;
delete loginSchema.properties.password.errorPattern;

const schema = {
  content: loginSchema
};

export { schema, controller };
