import { HttpUnauthorizedException } from "@kanban/base-lib";
import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async getAuthenticatedUser(id: string) {
    const user = await this.users.findOneById(id);
    if (!user)
      throw new HttpUnauthorizedException({
        errorCode: "Unauthorized",
        message: "Unauthorized. User does not exists"
      });
    return { id: user.id, email: user.email };
  }

  async getCurrentUserInfo(id: string) {
    return { user: await this.getAuthenticatedUser(id) };
  }

  async deleteUser(id: string) {
    const deleted = await this.users.deleteById(id);
    if (!deleted) throw new HttpUnauthorizedException({ errorCode: "Unauthorized" });
    return { deletedUser: { id: deleted.id, email: deleted.email } };
  }
}
