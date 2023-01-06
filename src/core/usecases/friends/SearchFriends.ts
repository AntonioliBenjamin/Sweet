import { User } from "../../Entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export type FriendsSeachInput = {
  keyword: string;
  schoolId?: string;
};

export class SearchFriends
  implements UseCase<FriendsSeachInput, Promise<User[]>>
{
  constructor(private readonly userRepository: UserRepository) {}

  execute(input: FriendsSeachInput): Promise<User[]> {
    return this.userRepository.searchFriends(input.keyword, input.schoolId);
  }
}
