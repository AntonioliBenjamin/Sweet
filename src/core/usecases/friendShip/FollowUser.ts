
import { Followed } from "../../Entities/Followed";
import { FollowErrors } from "../../errors/FollowErrors";
import { IdGateway } from "../../gateways/IdGateway";
import { FollowedRepository } from "../../repositories/FollowedRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export type CreateFriendShipProperties = {
    senderId: string
    recipientId: string
}

export class FollowUser implements UseCase<CreateFriendShipProperties, Followed> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly friendShipRepository: FollowedRepository,
        private readonly idGateway: IdGateway,
    ) {}

    async execute(input: CreateFriendShipProperties): Promise<Followed> {
        const followAlreadyExists = await this.friendShipRepository.getFollowByUsersId(input.senderId, input.recipientId);
        if(followAlreadyExists) {
            throw new Error("FOLLOW_ALREADY_EXIST")
        }

        const user = await this.userRepository.getById(input.recipientId)
        if(!user) {
            throw new FollowErrors.AlreadyExist()
        }
        
        const FollowId = this.idGateway.generate()
        const followed = Followed.create({
            id: FollowId,
            recipientId: input.recipientId,
            senderId: input.senderId
        })

        await this.friendShipRepository.create(followed)

        return followed
    }
}