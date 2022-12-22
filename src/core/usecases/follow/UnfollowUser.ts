import {FollowErrors} from "../../errors/FollowErrors";
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UseCase} from "../Usecase";

export class UnfollowUser implements UseCase<string, Promise<void>> {
    constructor(
        private readonly followedRepository: FollowedRepository
    ) {
    }

    async execute(id: string): Promise<void> {
        const followed = await this.followedRepository.getById(id);
        if (!followed) {
            throw new FollowErrors.NotFound();
        }

        return await this.followedRepository.delete(followed.props.id);
    }
}