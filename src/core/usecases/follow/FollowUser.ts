
import { Followed } from "../../Entities/Followed";
import { FollowErrors } from "../../errors/FollowErrors";
import { IdGateway } from "../../gateways/IdGateway";
import { FollowedRepository } from "../../repositories/FollowedRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export type CreateFriendShipProperties = {
    addedBy: string
    userId: string
}

export class FollowUser implements UseCase<CreateFriendShipProperties, Followed> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly friendShipRepository: FollowedRepository,
        private readonly idGateway: IdGateway,
    ) {}

    async execute(input: CreateFriendShipProperties): Promise<Followed> {
        const followAlreadyExists = await this.friendShipRepository.getFollowByUsersId(input.addedBy, input.userId);
        if(followAlreadyExists) {
            return followAlreadyExists
        }
        
        const FollowId = this.idGateway.generate()
        const followed = Followed.create({
            id: FollowId,
            userId: input.userId,
            addedBy: input.addedBy
        })

        await this.friendShipRepository.create(followed)

        return followed
    }
}