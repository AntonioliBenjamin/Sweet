import { inject, injectable } from "inversify";
import { UseCase } from "../Usecase";
import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { PasswordGateway } from "../../gateways/PasswordGateway";
import { UserErrors } from "../../errors/UserErrors";
import { identifiers } from "../../identifiers/identifiers";

export type UserSignInInput = {
  email: string;
  password: string;
};


@injectable()
export class SignIn implements UseCase<UserSignInInput, User> {
  constructor(
    @inject(identifiers.PasswordGateway) private readonly passwordGateway: PasswordGateway,
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(input: UserSignInInput): Promise<User> {
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
