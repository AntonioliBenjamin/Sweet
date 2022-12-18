import {UseCase} from "../Usecase";
import {Poll} from "../../Entities/Poll";
import {PollRepository} from "../../repositories/PollRepository";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import {PollErrors} from "../../errors/PollErrors";

export type AddQuestionToPollInput = {
    pollId : string;
    questionId: string;
};
export class AddQuestionToPoll implements UseCase<AddQuestionToPollInput, Promise<Poll>>
{
    constructor(
        private readonly pollRepository: PollRepository,
        private readonly questionRepository: QuestionRepository
    ) {}
    async execute(input: AddQuestionToPollInput): Promise<Poll> {
        const poll = await this.pollRepository.getByPollId(input.pollId);
        const question = await this.questionRepository.getByQuestionId(input.questionId);
        const canAddQuestion = poll.canAddQuestion(question.props.questionId);
        if (!canAddQuestion) {
            throw new PollErrors.QuestionAlreadyAdded();
        }
        poll.addQuestion(question.props);
        await this.pollRepository.update(poll);
        return Promise.resolve(poll);
    }
}