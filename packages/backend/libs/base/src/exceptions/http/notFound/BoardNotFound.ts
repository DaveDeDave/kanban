import { HttpException } from "../httpException";

export class BoardNotFoundException extends HttpException {
  constructor(message = "The board couldn't be found") {
    super(
      {
        statusCode: "NOT_FOUND",
        status: 401,
        errorCode: "BoardNotFound"
      },
      message
    );
  }
}
