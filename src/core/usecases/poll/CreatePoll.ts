import "dotenv/config";
import {UseCase} from "../Usecase";
import {Poll} from "../../Entities/Poll";
import {PollRepository} from "../../repositories/PollRepository";
import {IdGateway} from "../../gateways/IdGateway";
import {QuestionRepository} from "../../repositories/QuestionRepository";

const numberOfQuestions = +process.env.NUMBER_OF_QUESTIONS

export class CreatePoll implements UseCase<void, void> {
    constructor(
        private readonly pollRepository: PollRepository,
        private readonly questionRepository: QuestionRepository,
        private readonly idGateway: IdGateway
    ) {
    }

    async execute(): Promise<void> {
        const id = this.idGateway.generate();
        const poll = Poll.create({pollId: id});
        const allQuestions = await this.questionRepository.getAllQuestions();

        const questions = await this.questionRepository.selectRandomQuestions(allQuestions.length >= numberOfQuestions ? numberOfQuestions : allQuestions.length);

        poll.update({questions: questions,});
        await this.pollRepository.create(poll);

        return;
    }
}
