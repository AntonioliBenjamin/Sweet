import {User} from "../../Entities/User";
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UserRepository} from "../../repositories/UserRepository";
import {UseCase} from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

@injectable()
export class GetMyFollows implements UseCase<string, Promise<User[]>> {
    constructor(
        @inject(identifiers.FollowedRepository) private readonly followRepository: FollowedRepository,
        @inject(identifiers.UserRepository) private readonly userRepository: UserRepository
    ) {
    }

    async execute(myUserId: string): Promise<User[]> {
        const follows = await this.followRepository.getMyFollows(myUserId)

        const userIds = follows.map(elem => elem.props.userId)

        const users = await this.userRepository.getByUserIds(userIds)

        return Promise.all(users)
    }
}
