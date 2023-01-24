import {Followed} from "../../Entities/Followed";
import {IdGateway} from "../../gateways/IdGateway";
import {FollowedRepository} from "../../repositories/FollowedRepository";
import {UseCase} from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

export type CreateFollowProperties = {
    addedBy: string
    userId: string
}

@injectable()
export class FollowUser implements UseCase<CreateFollowProperties, Followed> {
    constructor(
        @inject(identifiers.FollowedRepository) private readonly followedRepository: FollowedRepository,
        @inject(identifiers.IdGateway) private readonly idGateway: IdGateway,
    ) {
    }

    async execute(input: CreateFollowProperties): Promise<Followed> {
        const followId = this.idGateway.generate();
        const followed = Followed.create({
            id: followId,
            userId: input.userId,
            addedBy: input.addedBy
        });
        await this.followedRepository.create(followed);
        return followed;
    }
}