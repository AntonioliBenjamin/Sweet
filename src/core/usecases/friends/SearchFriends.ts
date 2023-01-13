import { inject, injectable } from "inversify";
import { User } from "../../Entities/User";
import { identifiers } from "../../identifiers/identifiers";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export type FriendsSeachInput = {
  keyword: string;
  schoolId?: string;
};

@injectable()
export class SearchFriends
  implements UseCase<FriendsSeachInput, Promise<User[]>>
{
  constructor(
    @inject(identifiers.UserRepository) private readonly userRepository: UserRepository
    ) {}

  execute(input: FriendsSeachInput): Promise<User[]> {
    return this.userRepository.searchFriends(input.keyword, input.schoolId);
  }
}
