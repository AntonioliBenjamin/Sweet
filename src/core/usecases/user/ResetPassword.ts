import { inject, injectable } from "inversify";
import { UseCase } from "../Usecase";
import { UserRepository } from "../../repositories/UserRepository";
import { PasswordGateway } from "../../gateways/PasswordGateway";
import { identifiers } from "../../identifiers/identifiers";

export type ResetPasswordInput = {
  id: string;
  password: string;
  recoveryCode: string;
};

@injectable()
export class ResetPassword implements UseCase<ResetPasswordInput, void> {
  constructor(
    @inject(identifiers.PasswordGateway) private readonly passwordGateway: PasswordGateway,
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const user = await this.userRepository.getById(input.id);

    const encryptedPassword = this.passwordGateway.encrypt(input.password);

    user.resetPassword({
      recoveryCode: input.recoveryCode,
      password: encryptedPassword,
    });

    await this.userRepository.updatePassword(user);

    return;
  }
}
