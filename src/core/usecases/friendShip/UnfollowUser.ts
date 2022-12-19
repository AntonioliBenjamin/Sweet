import { FollowErrors } from "../../errors/FollowErrors";
import { FollowedRepository } from "../../repositories/FollowedRepository";
import { UseCase } from "../Usecase";

export class UnfollowUser implements UseCase<string, Promise<void>> {
    constructor(
        private readonly friendShipRepository: FollowedRepository
    ) {}

    async execute(id: string): Promise<void> {
        const followed = await this.friendShipRepository.getById(id)
        if(!followed) {
            throw new FollowErrors.NotFound()
        }
        return await this.friendShipRepository.delete(followed.props.id)
    }
}