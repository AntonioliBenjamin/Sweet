import { inject, injectable } from "inversify";
import { Answer } from "../../Entities/Answer";
import { identifiers } from "../../identifiers/identifiers";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";
import {inject, injectable} from "inversify";
import {identifiers} from "../../identifiers/identifiers";

export type GetLastQuestionAnsweredInput = {
    userId: string;
    pollId: string;
}

@injectable()
export class GetLastQuestionAnswered implements UseCase<GetLastQuestionAnsweredInput, Answer> {
    constructor(
        @inject(identifiers.AnswerRepository) private readonly answerRepository: AnswerRepository
    ) {}

    async execute(input: GetLastQuestionAnsweredInput): Promise<Answer> {
        return await this.answerRepository.getLastQuestionAnswered(input.pollId, input.userId);
    }
    
}