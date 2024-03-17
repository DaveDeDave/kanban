import { HttpException } from "../httpException";

export class ColumnNotFoundException extends HttpException {
  constructor(message = "The column couldn't be found") {
    super(
      {
        statusCode: "NOT_FOUND",
        status: 401,
        errorCode: "ColumnNotFound"
      },
      message
    );
  }
}
