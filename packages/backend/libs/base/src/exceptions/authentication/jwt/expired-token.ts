import { AuthenticationException } from "../authentication-exception";

export class ExpiredTokenException extends AuthenticationException {
  constructor(message = "The token has expired") {
    super(message);
  }
}
