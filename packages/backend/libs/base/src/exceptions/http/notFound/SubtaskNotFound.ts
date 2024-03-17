import { HttpException } from "../httpException";

export class SubtaskNotFoundException extends HttpException {
  constructor(message = "The subtask couldn't be found") {
    super(
      {
        statusCode: "NOT_FOUND",
        status: 401,
        errorCode: "SubtaskNotFound"
      },
      message
    );
  }
}
