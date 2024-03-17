import { HttpException } from "../httpException";

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", cause?: Error) {
    super(
      {
        statusCode: "UNAUTHORIZED",
        status: 401,
        errorCode: "Unauthorized"
      },
      message,
      cause
    );
  }
}
