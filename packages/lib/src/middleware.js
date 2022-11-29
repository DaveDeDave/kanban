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
  const token = request.headers.get("authorization").split(" ")[1];
  const payload = await verify(token);
  request.user = payload;
};

export { errorHandler, autheticated };
