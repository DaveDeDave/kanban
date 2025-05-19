import { HttpException } from "../http-exception";

export type HttpUnauthorizedExceptionCode = "MissingToken" | "WrongCredentials" | "Unauthorized";

export interface HttpUnauthorizedExpectionInput {
  errorCode: HttpUnauthorizedExceptionCode;
  message?: string;
  cause?: Error;
}

const defaultErrorMessages: Record<HttpUnauthorizedExceptionCode, string> = {
  MissingToken: "The token is missing",
  WrongCredentials: "The submitted credentials are wrong",
  Unauthorized: "Unauthorized"
};

export class HttpUnauthorizedException extends HttpException {
  constructor({ errorCode, message, cause }: HttpUnauthorizedExpectionInput) {
    super(
      {
        statusCode: "UNAUTHORIZED",
        status: 401,
        errorCode
      },
      message || defaultErrorMessages[errorCode],
      cause
    );
  }
}
