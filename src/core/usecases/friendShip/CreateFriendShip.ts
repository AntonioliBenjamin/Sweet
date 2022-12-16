import { FriendShip } from "../../Entities/FriendShip";
import { UserErrors } from "../../errors/UserErrors";
import { IdGateway } from "../../gateways/IdGateway";
import { FriendShipRepository } from "../../repositories/FriendShipRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { UseCase } from "../Usecase";

export type CreateFriendShipProperties = {
    senderId: string
    recipientId: string
}

export class CreateFriendShip implements UseCase<CreateFriendShipProperties, FriendShip> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly friendShipRepository: FriendShipRepository,
        private readonly idGateway: IdGateway,
    ) {}

    async execute(input: CreateFriendShipProperties): Promise<FriendShip> {
        const friendShipAlreadyExists = await this.friendShipRepository.getFriendShipByUsersId(input.senderId, input.recipientId);
        if(friendShipAlreadyExists) {
            return friendShipAlreadyExists
        }
        
        const user = await this.userRepository.getById(input.recipientId)
        if(!user) {
            throw new UserErrors.NotFound()
        }
        
        const friendShipId = this.idGateway.generate()
        const friendship = FriendShip.create({
            id: friendShipId,
            recipientId: input.recipientId,
            senderId: input.senderId
        })

        await this.friendShipRepository.create(friendship)

        return friendship
    }
}