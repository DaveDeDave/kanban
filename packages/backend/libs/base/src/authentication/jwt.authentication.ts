import jwt from "@tsndr/cloudflare-worker-jwt";
import { InvalidTokenException } from "../exceptions/authentication";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

interface JwtHelperInput {
  secret: string;
}

class JwtHelper {
  #secret: string;

  constructor(input: JwtHelperInput) {
    this.#secret = input.secret;
  }

  async sign(
    input: Record<string, unknown>,
    { expiresIn = ONE_WEEK_IN_SECONDS } = { expiresIn: ONE_WEEK_IN_SECONDS }
  ) {
    return jwt.sign({ ...input, exp: Math.floor(Date.now() / 1000 + expiresIn) }, this.#secret);
  }

  async verify(input: string) {
    const isValid = await jwt.verify(input, this.#secret);
    if (!isValid) {
      throw new InvalidTokenException();
    }
    const { payload } = jwt.decode(input);
    return payload;
  }
}

export const getJwtHelper = async (secret: string) => {
  return new JwtHelper({ secret });
};
