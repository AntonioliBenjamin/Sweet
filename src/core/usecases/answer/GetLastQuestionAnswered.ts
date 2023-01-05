import { Answer } from "../../Entities/Answer";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";

export type GetLastQuestionAnsweredInput = {
    userId: string;
    pollId: string;
}

export class GetLastQuestionAnswered implements UseCase<GetLastQuestionAnsweredInput, Answer> {
    constructor(
        private readonly answerRepository: AnswerRepository
    ) {}

    async execute(input: GetLastQuestionAnsweredInput): Promise<Answer> {
        const answer = await this.answerRepository.getLastQuestionAnswered(input.pollId, input.userId)
        return answer
    }
    
}