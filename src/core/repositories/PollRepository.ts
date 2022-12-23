import {Poll} from "../Entities/Poll";

export interface PollRepository {
    create(input: Poll): Promise<Poll>;

    getAllPolls(input: void): Promise<Poll[]>;

    getCurrentPoll(input: void): Promise<Poll>;

    delete(pollId: string): Promise<void>;
}