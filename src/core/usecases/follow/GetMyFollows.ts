import { User } from "../../Entities/User";
import { FollowedRepository } from "../../repositories/FollowedRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export class GetMyFollows implements UseCase<string, Promise<User[]>> {
    constructor(
        private readonly followRepository: FollowedRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(myUserId: string): Promise<User[]> {
        const follows = await this.followRepository.getMyFollows(myUserId)
        
        const userIds = follows.map(elem => elem.props.userId)

        const users = await this.userRepository.getByUserIds(userIds)
        
        return Promise.all(users)
    }
}
