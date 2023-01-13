import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UseCase} from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

export type DeleteFollowProperties = {
    addedBy: string
    userId: string
}

@injectable()
export class UnfollowUser implements UseCase<DeleteFollowProperties, Promise<void>> {
    constructor(
        @inject(identifiers.FollowedRepository) private readonly followedRepository: FollowedRepository
    ) {
    }

    async execute(input: DeleteFollowProperties): Promise<void> {
        return await this.followedRepository.delete(input.userId, input.addedBy);
    }
}
