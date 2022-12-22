import {Poll} from "../Entities/Poll";
import {QuestionProperties} from "../Entities/Question";


export interface PollRepository {
    create(input: Poll): Promise<Poll>;

    getAllPolls(input: void): Promise<Poll[]>;

    getByPollId(pollId: string): Promise<Poll>;

    update(poll: Poll): Promise<Poll>;

}