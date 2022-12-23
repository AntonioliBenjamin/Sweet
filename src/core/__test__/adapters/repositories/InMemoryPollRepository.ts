import {PollRepository} from "../../../repositories/PollRepository";
import {Poll} from "../../../Entities/Poll";
import {questionFixtures} from "../../../fixtures/questionFixtures";
import {PollErrors} from "../../../errors/PollErrors";

export class InMemoryPollRepository implements PollRepository {
    constructor(
        private readonly db: Map<string, Poll>
    ) {
    }

    create(poll: Poll): Promise<Poll> {
        this.db.set(poll.props.pollId, poll);

        return Promise.resolve(poll);
    }

    getAllPolls(): Promise<Poll[]> {
        return Promise.resolve(Array.from(this.db.values()));
    }

    getCurrentPoll(input: void): Promise<Poll> {
        const pollsArray = Array.from(this.db.values());
        const currentPoll = pollsArray.sort((a, b) => +b.props.createdAt - +a.props.createdAt)[0];

        if (+currentPoll.props.expirationDate < +new Date()) {
            throw new PollErrors.DateExpired()
        }

        return Promise.resolve(currentPoll);
    }

    delete(pollId: string): Promise<void> {
        this.db.delete(pollId);
        return;
    }
}