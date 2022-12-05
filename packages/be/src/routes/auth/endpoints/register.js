import { bcryptWrapper, jwt } from "@kanban/lib";
import { json } from "itty-router-extras";
import { User } from "@kanban/models";
import { HTTPError } from "@kanban/lib/src/error.js";

const controller = async ({ mongo, content }) => {
  const password = await bcryptWrapper.hash(content.password, 10);
  content.email = content.email.toLowerCase();
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

const schema = {
  content: User.schema
};

export default { schema, controller };
