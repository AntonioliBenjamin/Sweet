import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export class EmailExist implements UseCase<string, Boolean> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<Boolean> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return false;
    }
    return true;
  }
}
