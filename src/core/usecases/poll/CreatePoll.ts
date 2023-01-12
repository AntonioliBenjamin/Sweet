import "dotenv/config";
import {UseCase} from "../Usecase";
import {Poll} from "../../Entities/Poll";
import {PollRepository} from "../../repositories/PollRepository";
import {IdGateway} from "../../gateways/IdGateway";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import { inject, injectable } from "inversify";
import { identifiers } from "../../identifiers/identifiers";

const numberOfQuestions = +process.env.NUMBER_OF_QUESTIONS

@injectable()
export class CreatePoll implements UseCase<void, void> {
    constructor(
        @inject(identifiers.PollRepository) private readonly pollRepository: PollRepository,
        @inject(identifiers.QuestionRepository) private readonly questionRepository: QuestionRepository,
        @inject(identifiers.IdGateway) private readonly idGateway: IdGateway
    ) {
    }

    async execute(): Promise<void> {
        const id = this.idGateway.generate();
        const poll = Poll.create({pollId: id});
        const allQuestions = await this.questionRepository.getAll();

        const questions = await this.questionRepository.selectRandom(allQuestions.length >= numberOfQuestions ? numberOfQuestions : allQuestions.length);

        poll.update({questions: questions,});
        await this.pollRepository.create(poll);

        return;
    }
}
