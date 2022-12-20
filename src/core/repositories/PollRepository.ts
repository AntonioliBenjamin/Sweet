import {Poll} from "../Entities/Poll";
import {QuestionProperties} from "../Entities/Question";


export interface PollRepository {
    create(input: Poll): Promise<Poll>;

    getAllPolls(input: void): Promise<Poll[]>;

    getByPollId(pollId: string): Promise<Poll>;

    addQuestions(poll: Poll, questions: QuestionProperties[]): Promise<Poll>;

    update(input: Poll): Promise<Poll>;
}