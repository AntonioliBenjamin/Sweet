import {User} from "../../Entities/User";
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UserRepository} from "../../repositories/UserRepository";
import {UseCase} from "../Usecase";

export class GetFollowingsByUserId implements UseCase<string, Promise<User[]>> {
    constructor(
        private readonly followedRepository: FollowedRepository,
        private readonly userRepository: UserRepository
    ) {
    }

    async execute(id: string): Promise<User[]> {
        const followersIds = await this.followedRepository.getFollowingsByUserId(id);

        const users = followersIds.map(async elm => {
            return await this.userRepository.getById(elm)
        });

        return Promise.all(users);
    }
}