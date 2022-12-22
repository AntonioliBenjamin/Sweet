import {Followed} from "../../Entities/Followed";
import {IdGateway} from "../../gateways/IdGateway";
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UseCase} from "../Usecase";

export type CreateFollowProperties = {
    addedBy: string
    userId: string
}

export class FollowUser implements UseCase<CreateFollowProperties, Followed> {
    constructor(
        private readonly followedRepository: FollowedRepository,
        private readonly idGateway: IdGateway,
    ) {
    }

    async execute(input: CreateFollowProperties): Promise<Followed> {
        const followAlreadyExists = await this.followedRepository.exists(input.addedBy, input.userId);
        if (followAlreadyExists) {
            return followAlreadyExists
        }

        const FollowId = this.idGateway.generate();

        const followed = Followed.create({
            id: FollowId,
            userId: input.userId,
            addedBy: input.addedBy
        });

        await this.followedRepository.create(followed);

        return followed
    }
}