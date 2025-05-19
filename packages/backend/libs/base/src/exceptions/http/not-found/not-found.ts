import { HttpException } from "../http-exception";

export type HttpNotFoundExceptionCode =
  | "BoardNotFound"
  | "ColumnNotFound"
  | "TaskNotFound"
  | "SubtaskNotFound";

export interface HttpNotFoundExceptionInput {
  errorCode: HttpNotFoundExceptionCode;
  message?: string;
}

const defaultErrorMessages: Record<HttpNotFoundExceptionCode, string> = {
  BoardNotFound: "The board couldn't be found",
  ColumnNotFound: "The column couldn't be found",
  TaskNotFound: "The task couldn't be found",
  SubtaskNotFound: "The subtask couldn't be found"
};

export class HttpNotFoundException extends HttpException {
  constructor({ errorCode, message }: HttpNotFoundExceptionInput) {
    super(
      {
        statusCode: "NOT_FOUND",
        status: 404,
        errorCode
      },
      message || defaultErrorMessages[errorCode]
    );
  }
}
