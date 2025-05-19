import { AuthenticationException } from "../authentication-exception";

export class MalformedTokenException extends AuthenticationException {
  constructor(message = "The token is malformed") {
    super(message);
  }
}
