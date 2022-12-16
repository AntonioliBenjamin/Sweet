import { FriendShipErrors } from "../../errors/FriendShipErrors";
import { FriendShipRepository } from "../../repositories/FriendShipRepository";
import { UseCase } from "../Usecase";

export class DeleteFriendShip implements UseCase<string, Promise<void>> {
    constructor(
        private readonly friendShipRepository: FriendShipRepository
    ) {}

    async execute(id: string): Promise<void> {
        const friendship = await this.friendShipRepository.getById(id)
        if(!friendship) {
            throw new FriendShipErrors.NotFound()
        }
        return await this.friendShipRepository.delete(friendship.props.id)
    }
}