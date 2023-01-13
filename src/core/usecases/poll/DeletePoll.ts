import {UseCase} from "../Usecase";
import {PollRepository} from "../../repositories/PollRepository";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

export type DeletePollInput = {
    pollId: string;
};

@injectable()
export class DeletePoll implements UseCase<DeletePollInput, void> {
    constructor(
        @inject(identifiers.PollRepository) private readonly pollRepository: PollRepository
    ) {
    }

    async execute(input: DeletePollInput): Promise<void> {
        const pollId = input.pollId;

        await this.pollRepository.delete(pollId);

        return;
    }
}
