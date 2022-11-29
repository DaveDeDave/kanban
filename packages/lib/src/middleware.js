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

export { errorHandler };
