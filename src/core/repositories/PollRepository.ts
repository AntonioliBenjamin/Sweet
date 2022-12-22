import {Poll} from "../Entities/Poll";

export interface PollRepository {
    create(input: Poll): Promise<Poll>;

    getAllPolls(input: void): Promise<Poll[]>;
}