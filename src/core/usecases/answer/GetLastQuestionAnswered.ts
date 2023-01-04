import { Question } from "../../Entities/Question";
import { AnswerRepository } from "../../repositories/AnswerRepository";
import { UseCase } from "../Usecase";

export type GetLastQuestionAnsweredInput = {
    userId: string;
    pollId: string;
}

export class GetLastQuestionAnswered implements UseCase<GetLastQuestionAnsweredInput, Question> {
    constructor(
        private readonly answerRepository: AnswerRepository
    ) {}

    async execute(input: GetLastQuestionAnsweredInput): Promise<Question> {
        const question = await this.answerRepository.getLastQuestionAnswered(input.pollId, input.userId)
        return question
    }
    
}