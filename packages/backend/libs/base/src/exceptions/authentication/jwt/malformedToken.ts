import { AuthenticationException } from "../authenticationException";

export class MalformedTokenException extends AuthenticationException {
  constructor(message = "The token is malformed") {
    super(message);
  }
}
