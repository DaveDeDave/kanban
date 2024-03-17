import { HttpException } from "../httpException";

export class EmailAlreadyExistsException extends HttpException {
  constructor(message = "The email already exists") {
    super(
      {
        statusCode: "BAD_REQUEST",
        status: 401,
        errorCode: "EmailAlreadyExists"
      },
      message
    );
  }
}
