import { UseCase } from "../Usecase";
import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { PasswordGateway } from "../../gateways/PasswordGateway";
import { UserErrors } from "../../errors/UserErrors";

export type UserInput = {
  email: string;
  password: string;
};

export class SignIn implements UseCase<UserInput, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordGateway: PasswordGateway
  ) {}

  async execute(input: UserInput): Promise<User> {
    const user = await this.userRepository.getByEmail(
      input.email.toLowerCase().trim()
    );
    if (!user) {
      throw new UserErrors.WrongEmail();
    }

    const hash = user.props.password;

    const comparePasswords = this.passwordGateway.decrypt(input.password, hash);
    if (!comparePasswords) {
      throw new UserErrors.WrongPassword();
    }

    return user;
  }
}
