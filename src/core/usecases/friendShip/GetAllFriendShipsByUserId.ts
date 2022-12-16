import { FriendShip } from "../../Entities/FriendShip";
import { FriendShipRepository } from "../../repositories/FriendShipRepository";
import { UseCase } from "../Usecase";

export class GetAllFriendShipsByUserId implements UseCase<string, FriendShip[]> {
    constructor(
        private readonly friendshipRepository: FriendShipRepository
    ) {}

    async execute(id: string): Promise<FriendShip[]> {
        return await this.friendshipRepository.getAllFriendShipsByUserId(id)
    }
    
}