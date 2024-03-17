import { AuthenticationException } from "../authenticationException";

export class ExpiredTokenException extends AuthenticationException {
  constructor(message = "The token has expired") {
    super(message);
  }
}
