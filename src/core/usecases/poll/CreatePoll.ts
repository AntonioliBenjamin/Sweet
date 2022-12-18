import {UseCase} from "../Usecase";
import {Poll} from "../../Entities/Poll";
import {PollRepository} from "../../repositories/PollRepository";
import {IdGateway} from "../../gateways/IdGateway";

export class CreatePoll implements UseCase<void, void> {
    constructor(
        private readonly pollRepository: PollRepository,
        private readonly idGateway: IdGateway,
    ) {
    }

    async execute(): Promise<void> {
        const id = this.idGateway.generate();
        const poll = Poll.create({
            pollId: id,
        })
        await this.pollRepository.create(poll);
        return
    }
}