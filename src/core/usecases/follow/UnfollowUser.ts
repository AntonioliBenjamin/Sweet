
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UseCase} from "../Usecase";

export type DeleteFollowProperties = {
    addedBy: string
    userId: string
}

export class UnfollowUser implements UseCase<DeleteFollowProperties, Promise<void>> {
    constructor(
        private readonly followedRepository: FollowedRepository
    ) {
    }

    async execute(input: DeleteFollowProperties): Promise<void> {
        return await this.followedRepository.delete({userId : input.userId, addedBy : input.addedBy});
    }
}
