import { jwt, regex } from "@kanban/lib";
import { compare } from "@kanban/lib/src/bcryptWrapper";
import { HTTPError } from "@kanban/lib/src/error";
import { json } from "itty-router-extras";

export default async ({ mongo, content }) => {
  validate(content);
  const user = await mongo
    .collection("user")
    .findOne({ email: content.email }, { projection: { _id: 0 } });
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
  const token = await jwt.sign(user, {});
  return json({ token });
};

const validate = (content) => {
  if (!content.email)
    throw new HTTPError({
      code: "error.missing_email",
      status: 400,
      message: "email field missing"
    });
  if (!content.password)
    throw new HTTPError({
      code: "error.missing_password",
      status: 400,
      message: "password field missing"
    });
  if (!regex.email.test(content.email))
    throw new HTTPError({
      code: "error.wrong_format_email",
      status: 400,
      message: "email field must be email format"
    });
};
