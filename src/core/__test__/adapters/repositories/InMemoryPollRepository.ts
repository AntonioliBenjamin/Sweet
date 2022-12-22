import {PollRepository} from "../../../repositories/PollRepository";
import {Poll} from "../../../Entities/Poll";
import {questionFixtures} from "../../../fixtures/questionFixtures";

export class InMemoryPollRepository implements PollRepository {
    constructor(private readonly db: Map<string, Poll>) {
    }

    create(poll: Poll): Promise<Poll> {
        this.db.set(poll.props.pollId, poll);
        return Promise.resolve(poll)
    }

    getAllPolls(): Promise<Poll[]> {
        return Promise.resolve(Array.from(this.db.values()));
    }

    getByPollId(pollId: string): Promise<Poll> {
        return Promise.resolve(this.db.get(pollId));
    }

    update(poll: Poll): Promise<Poll> {
        poll.props.questions = questionFixtures;
        this.db.set(poll.props.pollId, poll);
        return Promise.resolve(poll);
    }
}