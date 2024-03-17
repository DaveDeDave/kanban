import { HttpException } from "../httpException";

export class MissingTokenException extends HttpException {
  constructor(message = "The token is missing") {
    super(
      {
        statusCode: "UNAUTHORIZED",
        status: 401,
        errorCode: "MissingToken"
      },
      message
    );
  }
}
