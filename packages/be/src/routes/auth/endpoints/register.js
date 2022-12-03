import { bcryptWrapper, jwt, regex } from "@kanban/lib";
import { json } from "itty-router-extras";
import { User } from "@kanban/models";
import { HTTPError } from "@kanban/lib/src/error";

export default async ({ mongo, content }) => {
  validate(content);
  const password = await bcryptWrapper.hash(content.password, 10);
  const user = new User({ email: content.email, password });
  try {
    const result = await mongo.collection("user").insertOne(user);
    user._id = result.insertedId;
  } catch (e) {
    if (e.name == "MongoServerError" && e.code == "11000")
      throw new HTTPError({
        code: "error.already_exists_email",
        status: 400,
        message: "email already exists"
      });
    else throw e;
  }
  delete user.password;
  const token = await jwt.sign(user);
  return json({ token });
};

const validate = (content) => {
  if (content === undefined)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (content.email === undefined)
    throw new HTTPError({
      code: "error.missing_email",
      status: 400,
      message: "email field missing"
    });
  if (content.password === undefined)
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
  if (!regex.password.test(content.password))
    throw new HTTPError({
      code: "error.too_weak_password",
      status: 400,
      message:
        "password field must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number and a symbol among these: !\"#$%'()*+,-./"
    });
};
