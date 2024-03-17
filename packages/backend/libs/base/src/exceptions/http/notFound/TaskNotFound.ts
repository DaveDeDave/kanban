import { HttpException } from "../httpException";

export class TaskNotFoundException extends HttpException {
  constructor(message = "The task couldn't be found") {
    super(
      {
        statusCode: "NOT_FOUND",
        status: 401,
        errorCode: "TaskNotFound"
      },
      message
    );
  }
}
