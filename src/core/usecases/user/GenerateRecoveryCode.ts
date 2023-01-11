import { inject, injectable } from "inversify";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";
import { UserErrors } from "../../errors/UserErrors";
import { IdGateway } from "../../gateways/IdGateway";
import { User } from "../../Entities/User";
import { identifiers } from "../../identifiers/identifiers";

export type GenerateRecoveryCodeInput = {
  email: string;
};

@injectable()
export class GenerateRecoveryCode
  implements UseCase<GenerateRecoveryCodeInput, User>
{
  constructor(
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository,
    @inject(identifiers.IdGateway) private readonly idGateway: IdGateway,
  ) {}

  async execute(input: GenerateRecoveryCodeInput): Promise<User> {
    const user = await this.userRepository.getByEmail(input.email);
    if (!user) {
      throw new UserErrors.WrongEmail();
    }

    const recoveryCode = this.idGateway.generate();

    user.updateRecoveryCode(recoveryCode);

    await this.userRepository.update(user);

    return user;
  }
}
