import { AuthenticationException } from "../authenticationException";

export class InvalidTokenException extends AuthenticationException {
  constructor(message = "The token is invalid") {
    super(message);
  }
}
