import { UseCase } from "../Usecase";
import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";

export type UserUpdatedInput = {
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  section: string;
  id: string;
};

export class UpdateUser implements UseCase<UserUpdatedInput, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UserUpdatedInput): Promise<User> {
    const user = await this.userRepository.getById(input.id);

    user.update({
      age: input.age,
      firstName: input.firstName,
      lastName: input.lastName,
      section: input.section,
      userName: input.userName,
    });

    await this.userRepository.update(user);

    return Promise.resolve(user);
  }
}
