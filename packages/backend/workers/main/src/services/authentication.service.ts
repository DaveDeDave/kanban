import {
  compare,
  ExpiredTokenException,
  hash,
  HttpUnauthorizedException,
  InvalidTokenException
} from "@kanban/base-lib";
import { HttpBadRequestException } from "@kanban/base-lib/src/exceptions/http/bad-request/bad-request";
import { UserRepository } from "@/repositories/user.repository";
import { UserService } from "./user.service";
import { getJwtHelper } from "@kanban/base-lib";

type Jwt = Awaited<ReturnType<typeof getJwtHelper>>;

export class AuthenticationService {
  constructor(
    private readonly users: UserRepository,
    private readonly userService: UserService,
    private readonly jwt: Jwt
  ) {}

  async register(email: string, password: string) {
    if (await this.users.findOneByEmail(email))
      throw new HttpBadRequestException({ errorCode: "EmailAlreadyExists" });
    const user = await this.users.create({ email, hashedPassword: await hash(password, 10) });
    return { token: await this.jwt.sign({ id: user.id, email: user.email }) };
  }

  async login(email: string, password: string) {
    const user = await this.users.findOneByEmail(email);
    if (!user || !(await compare(password, user.hashedPassword)))
      throw new HttpUnauthorizedException({ errorCode: "WrongCredentials" });
    return { token: await this.jwt.sign({ id: user.id, email: user.email }) };
  }

  async authenticate(authorizationHeader: string | null) {
    if (!authorizationHeader) throw new HttpUnauthorizedException({ errorCode: "MissingToken" });
    let payload: { id: string };
    try {
      payload = (await this.jwt.verify(authorizationHeader.replace("Bearer ", ""))) as {
        id: string;
      };
    } catch (error) {
      if (error instanceof InvalidTokenException || error instanceof ExpiredTokenException) {
        throw new HttpUnauthorizedException({ errorCode: "Unauthorized", cause: error });
      }
      throw error;
    }
    return this.userService.getAuthenticatedUser(payload.id);
  }
}
