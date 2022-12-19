
import { Followed } from "../../Entities/Followed";
import { FollowedRepository } from "../../repositories/FollowedRepository";

import { UseCase } from "../Usecase";

export class GetFollowersByUsersId implements UseCase<string, Followed[]> {
    constructor(
        private readonly friendshipRepository: FollowedRepository
    ) {}

    async execute(id: string): Promise<Followed[]> {
        return await this.friendshipRepository.getFollowersByUsersId(id)
    }
    
}