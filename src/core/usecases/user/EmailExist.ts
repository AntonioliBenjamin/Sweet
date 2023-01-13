import { inject, injectable } from "inversify";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";
import { identifiers } from "../../identifiers/identifiers";

@injectable()
export class EmailExist implements UseCase<string, boolean> {
  constructor(
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async execute(email: string): Promise<boolean> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return false;
    }
    return true;
  }
}
