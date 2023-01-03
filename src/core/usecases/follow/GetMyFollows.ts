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
        
        let arr = []
        for (let follow of follows) {
                arr.push(follow.props.addedBy, follow.props.userId) 
        }
        
        const usersIds = arr.filter((elm, index ) => {
            return elm !== myUserId && arr.indexOf(elm) == index
        })

        const users = await this.userRepository.getByIdArray(usersIds)
        
        return Promise.all(users)
    }
}
