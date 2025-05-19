import { AuthenticationException } from "../authentication-exception";

export class InvalidTokenException extends AuthenticationException {
  constructor(message = "The token is invalid") {
    super(message);
  }
}
