import { HttpException } from "../httpException";

export class WrongCredentialsException extends HttpException {
  constructor(message = "The submitted credentials are wrong") {
    super(
      {
        statusCode: "UNAUTHORIZED",
        status: 401,
        errorCode: "WrongCredentials"
      },
      message
    );
  }
}
