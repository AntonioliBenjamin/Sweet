import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export class EmailExist implements UseCase<string, boolean> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<boolean> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return false;
    }
    return true;
  }
}
