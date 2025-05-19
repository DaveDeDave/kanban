import { HttpException } from "../http-exception";

export type BadRequestExceptionCode = "EmailAlreadyExists";

export interface HttpBadRequestExceptionInput {
  errorCode: BadRequestExceptionCode;
  message?: string;
}

const defaultErrorMessages: Record<BadRequestExceptionCode, string> = {
  EmailAlreadyExists: "The email already exists"
};

export class HttpBadRequestException extends HttpException {
  constructor({ errorCode, message }: HttpBadRequestExceptionInput) {
    super(
      {
        statusCode: "BAD_REQUEST",
        status: 400,
        errorCode
      },
      message || defaultErrorMessages[errorCode]
    );
  }
}
