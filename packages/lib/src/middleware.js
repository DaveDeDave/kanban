import { verify } from "./jwt";
import { HTTPError } from "./error";

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
  const user = await request.mongo.collection("user").findOne({ email: payload.email });
  if (!user)
    throw new HTTPError({ code: "error.invalid_token", status: 401, message: "Invalid token" });
  request.user = payload;
};

export { errorHandler, autheticated };
