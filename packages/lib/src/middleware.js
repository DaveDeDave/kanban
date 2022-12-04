import { verify } from "./jwt.js";
import { HTTPError } from "./error.js";
import { validateSchema } from "./jsonschema.js";

const errorHandler = (error) => {
  if (error.name == "HTTPError") {
    return new Response(error.toString(), {
      status: error.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } else {
    console.log(error);
    const unknownError = new HTTPError({
      code: "UnknowError",
      status: 500,
      message: "Unknown Error"
    });
    return new Response(unknownError.toString(), {
      status: unknownError.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const autheticated = async (request) => {
  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader)
    throw new HTTPError({ code: "error.missing_token", status: 401, message: "Missing token" });
  const token = authorizationHeader.split(" ")[1];
  const payload = await verify(token);
  const user = await request.mongo
    .collection("user")
    .findOne({ _id: request.mongo.ObjectID(payload._id), email: payload.email });
  if (!user)
    throw new HTTPError({ code: "error.invalid_token", status: 401, message: "Invalid token" });
  request.user = payload;
};

const validate =
  (schema) =>
  async ({ content, params, query }) => {
    const { content: contentSchema, params: paramsSchema, query: querySchema } = schema;
    if (contentSchema) await validateSchema(contentSchema, content);
    if (paramsSchema) await validateSchema(paramsSchema, params);
    if (querySchema) await validateSchema(querySchema, query);
  };

export { errorHandler, autheticated, validate };
