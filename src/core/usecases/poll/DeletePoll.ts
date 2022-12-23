import {UseCase} from "../Usecase";
import {PollRepository} from "../../repositories/PollRepository";

export type DeletePollInput = {
    pollId: string;
};

export class DeletePoll implements UseCase<DeletePollInput, void> {
    constructor(
        private readonly pollRepository: PollRepository
    ) {

    }

    async execute(input: DeletePollInput): Promise<void> {
        const pollId = input.pollId;

        await this.pollRepository.delete(pollId);

        return;
    }
}
