import "reflect-metadata";
import { inject, injectable } from "inversify";
import { UserRepository } from "../../repositories/UserRepository";
import { User } from "../../Entities/User";
import { UseCase } from "../Usecase";
import { identifiers } from "../../identifiers/identifiers";

@injectable()
export class GetAllMyPotentialFriends implements UseCase<string, User[]> {
  @inject(identifiers.UserRepository) private readonly userRepository: UserRepository;

  async execute(schoolId: string): Promise<User[]> {
    return await this.userRepository.getAllUsersBySchool(schoolId);
  }
}
